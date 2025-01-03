import request from 'supertest-graphql';
import { ExecutionResult } from 'graphql';
import { mockedApp } from '../mocked-app-helper';
import { GitHubUrlHelper } from '@shared/resources/helpers/github-url.helper';
import { KafkaMessagingProvider } from '@shared/providers/messaging-provider/implementations/kafka-messaging.provider';

describe('List Answers (e2e)', () => {
  let challengeId: string;
  const createdAnswerIds: string[] = [];

  const amountOfRegisteredAnswers = 5;

  beforeAll(async () => {
    // Mock GitHub Helper
    jest.spyOn(GitHubUrlHelper, 'isGithubUrl').mockResolvedValue(true);

    // Mock KafkaMessagingProvider
    jest
      .spyOn(KafkaMessagingProvider.prototype, 'emitChallengeCorrection')
      .mockReturnValue();

    // Create a challenge to associate answers
    const createChallengeMutation = `
      mutation CreateChallenge($newChallengeData: CreateChallengeInput!) {
        createChallenge(newChallengeData: $newChallengeData) {
          data {
            id
          }
        }
      }
    `;

    const challengeResponse: ExecutionResult<any> = await request(
      mockedApp.getHttpServer(),
    )
      .mutate(createChallengeMutation)
      .variables({
        newChallengeData: {
          title: 'Test Challenge',
          description: 'This is a test challenge',
        },
      })
      .expectNoErrors();

    challengeId = challengeResponse.data.createChallenge.data.id;

    // Create multiple answers for the challenge
    const createAnswerMutation = `
      mutation AnswerChallenge($answerChallengeData: AnswerChallengeInput!) {
        answerChallenge(answerChallengeData: $answerChallengeData) {
          data {
            id
          }
        }
      }
    `;

    for (let i = 1; i <= amountOfRegisteredAnswers; i++) {
      const answerResponse: ExecutionResult<any> = await request(
        mockedApp.getHttpServer(),
      )
        .mutate(createAnswerMutation)
        .variables({
          answerChallengeData: {
            challengeId,
            repositoryUrl: `https://github.com/test/repo-${i}`,
          },
        })
        .expectNoErrors();

      createdAnswerIds.push(answerResponse.data.answerChallenge.data.id);
    }
  });

  it('should return a paginated list of answers', async () => {
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
            createdAt
          }
        }
      }
    `;

    const variables = {
      listAnswersData: {
        filter: {
          challengeId,
        },
        page: 1,
        limit: 3,
        orderBy: 'asc',
      },
    };

    const response: ExecutionResult<any> = await request(
      mockedApp.getHttpServer(),
    )
      .query(listAnswersQuery)
      .variables(variables)
      .expectNoErrors();

    // Capture response data
    const responseData = response.data.listAnswers;

    // Assertions
    expect(responseData).toBeDefined();
    expect(responseData.page).toBe(1);
    expect(responseData.limit).toBe(3);
    expect(responseData.total).toBe(amountOfRegisteredAnswers);
    expect(responseData.data).toHaveLength(3);

    // Verify individual answers
    responseData.data.forEach((answer: any) => {
      expect(answer.challengeId).toBe(challengeId);
      expect(answer.repositoryUrl).toMatch(
        /^https:\/\/github\.com\/test\/repo-/,
      );
    });
  });

  it('should return validation errors for invalid filter', async () => {
    const listAnswersQuery = `
      query ListAnswers($listAnswersData: ListAnswersInput!) {
        listAnswers(listAnswersData: $listAnswersData) {
          page
          limit
          total
          orderBy
          data {
            id
          }
        }
      }
    `;

    const variables = {
      listAnswersData: {
        filter: {
          challengeId: 'invalid-uuid',
        },
        page: 1,
        limit: 3,
        orderBy: 'asc',
      },
    };

    const response = await request(mockedApp.getHttpServer())
      .query(listAnswersQuery)
      .variables(variables);

    // Expect data to be null
    expect(response.data).toBeNull();

    // Expect errors
    const errors = response.errors as any;
    expect(errors).toBeDefined();
    expect(errors[0].message).toContain('Bad Request Exception');
    expect(errors[0].details.message[0]).toContain(
      'challengeId must be a UUID',
    );
  });
});
