import request from 'supertest-graphql';
import { ExecutionResult } from 'graphql';
import { ObjMap } from 'graphql/jsutils/ObjMap';
import { mockedApp } from '../mocked-app-helper';
import { Consumer, Kafka, Partitioners, Producer } from 'kafkajs';
import { env } from '@shared/resources/env';
import { GitHubUrlHelper } from '@shared/resources/helpers/github-url.helper';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('Answer Challenge (e2e)', () => {
  let kafka: Kafka;
  let producer: Producer;
  let consumer: Consumer;
  let challengeId: string;

  beforeAll(async () => {
    // Mock GitHub Helper
    jest.spyOn(GitHubUrlHelper, 'isGithubUrl').mockResolvedValue(true);

    // Initialize Kafka producer and consumer
    kafka = new Kafka({
      clientId: 'test-client',
      brokers: [env.KAFKA_BROKER_URL],
    });

    producer = kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
    consumer = kafka.consumer({ groupId: 'challenge-consumer' });

    await producer.connect();
    await consumer.connect();

    // Create a challenge for testing
    const createChallengeMutation = `
      mutation CreateChallenge($newChallengeData: CreateChallengeInput!) {
        createChallenge(newChallengeData: $newChallengeData) {
          data {
            id
            title
            description
            createdAt
          }
        }
      }
    `;

    const variables = {
      newChallengeData: {
        title: 'Test Challenge',
        description: 'This is a test challenge',
      },
    };

    const response: ExecutionResult<any, ObjMap<any>> = await request(
      mockedApp.getHttpServer(),
    )
      .mutate(createChallengeMutation)
      .variables(variables)
      .expectNoErrors();

    challengeId = response.data.createChallenge.data.id;
  }, 10000);

  afterAll(async () => {
    await producer.disconnect();
    await consumer.disconnect();
  }, 10000);

  it('should answer a challenge and handle the correction response', async () => {
    // Subscribe to the topic to mock a consumer response
    await consumer.subscribe({ topic: 'challenge.correction' });

    // Start the mock consumer to listen for correction requests and respond
    const correctionResponse = {
      grade: 8,
      status: 'Done',
    };

    const mockConsumer = new Promise<void>((resolve) => {
      consumer.run({
        eachMessage: async ({ topic, message }) => {
          if (topic === 'challenge.correction') {
            const payload = JSON.parse(message.value.toString());

            // Extract headers from the incoming message
            const headers = message.headers || {};
            const correlationId = headers['kafka_correlationId']?.toString();
            const replyTopic = headers['kafka_replyTopic']?.toString();

            // Respond to the reply topic
            await producer.send({
              topic: replyTopic,
              messages: [
                {
                  key: correlationId,
                  value: JSON.stringify({
                    submissionId: payload.submissionId,
                    repositoryUrl: payload.repositoryUrl,
                    ...correctionResponse,
                  }),
                  headers: {
                    kafka_correlationId: correlationId,
                  },
                },
              ],
            });

            resolve();
          }
        },
      });
    });

    // Mutation for answering a challenge
    const answerChallengeMutation = `
      mutation AnswerChallenge($answerChallengeData: AnswerChallengeInput!) {
        answerChallenge(answerChallengeData: $answerChallengeData) {
          data {
            id
            challengeId
            repositoryUrl
            status
            grade
            createdAt
          }
        }
      }
    `;

    const variables = {
      answerChallengeData: {
        challengeId: challengeId,
        repositoryUrl: 'https://github.com/test/repo',
      },
    };

    // Execute the answerChallenge mutation
    const response: ExecutionResult<any, ObjMap<any>> = await request(
      mockedApp.getHttpServer(),
    )
      .mutate(answerChallengeMutation)
      .variables(variables)
      .expectNoErrors();

    const responseData = response.data.answerChallenge.data;

    // Assert the initial response
    expect(responseData).toBeDefined();
    expect(responseData.id).toBeDefined();
    expect(responseData.challengeId).toBe(challengeId);
    expect(responseData.repositoryUrl).toBe(
      variables.answerChallengeData.repositoryUrl,
    );
    expect(responseData.status).toBe('Pending');
    expect(responseData.grade).toBeNull();

    // Wait for the mock consumer to finish processing
    await mockConsumer;

    await delay(500);

    // Assert the database has the updated answer after correction
    const listAnswersQuery = `
      query ListAnswers($listAnswersData: ListAnswersInput!) {
        listAnswers(listAnswersData: $listAnswersData) {
          page
          limit
          total
          orderBy
          data {
            id
            challengeId
            repositoryUrl
            status
            grade
          }
        }
      }
    `;

    const listAnswersVariables = {
      listAnswersData: {
        page: 1,
        limit: 2,
        orderBy: 'asc',
      },
    };

    const findAnswerResponse: ExecutionResult<any, ObjMap<any>> = await request(
      mockedApp.getHttpServer(),
    )
      .query(listAnswersQuery)
      .variables(listAnswersVariables)
      .expectNoErrors();

    const updatedAnswer = findAnswerResponse.data.listAnswers.data[0];

    expect(updatedAnswer).toBeDefined();
    expect(updatedAnswer.id).toBe(responseData.id);
    expect(updatedAnswer.status).toBe('Done');
    expect(updatedAnswer.grade).toBe(correctionResponse.grade);
  }, 100000);
});
