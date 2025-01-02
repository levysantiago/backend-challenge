import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest-graphql';
import { AppModule } from '../../../src/app.module';
import { ExecutionResult } from 'graphql';
import { ObjMap } from 'graphql/jsutils/ObjMap';
import { GraphQLHttpExceptionFilter } from '@shared/infra/filters/exception.filter';

describe('Create Challenge (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply the ValidationPipe
    app.useGlobalPipes(new ValidationPipe());

    // Apply the global exception filter
    app.useGlobalFilters(new GraphQLHttpExceptionFilter());

    // Enable shutdown hooks
    app.enableShutdownHooks();

    await app.init();
  }, 10000);

  afterAll(async () => {
    await app.close();
  }, 10000);

  it('should create a new challenge and return the challenge data', async () => {
    // Mutation
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

    // Mutation variables
    const variables = {
      newChallengeData: {
        title: 'Test Challenge',
        description: 'This is a test challenge',
      },
    };

    // Execute route
    const response: ExecutionResult<any, ObjMap<any>> = await request(
      app.getHttpServer(),
    )
      .mutate(createChallengeMutation)
      .variables(variables)
      .expectNoErrors();

    // Capture data
    const responseData = response.data.createChallenge.data;

    // Assert
    expect(responseData).toBeDefined();
    expect(responseData.id).toBeDefined();
    expect(responseData.title).toBe(variables.newChallengeData.title);
    expect(responseData.description).toBe(
      variables.newChallengeData.description,
    );
    expect(new Date(responseData.createdAt)).toBeInstanceOf(Date);
  });

  it('should return validation errors if title exceeds max length', async () => {
    // Mutation
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

    // Mutation variables
    const variables = {
      newChallengeData: {
        title: 'This title is way too long for the max length of 30 characters',
        description: 'This is a test challenge',
      },
    };

    // Execute route
    const response = await request(app.getHttpServer())
      .mutate(createChallengeMutation)
      .variables(variables);

    // Expect data to be null
    expect(response.data).toBeNull();

    // Expect errors
    const errors = response.errors as any;
    expect(errors).toBeDefined();
    expect(errors[0].message).toContain('Bad Request Exception');
    expect(errors[0].path[0]).toContain('createChallenge');
    expect(errors[0].details.statusCode).toEqual(400);
    expect(errors[0].details.message[0]).toContain('title');
  });

  it('should return validation errors if description exceeds max length', async () => {
    // Mutation
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

    // Mutation variables
    const variables = {
      newChallengeData: {
        title: 'Test Challenge',
        description: `This description is way too long for the max length of 255 characters
          This description is way too long for the max length of 255 characters
          This description is way too long for the max length of 255 characters
          This description is way too long for the max length of 255 characters`,
      },
    };

    // Execute route
    const response = await request(app.getHttpServer())
      .mutate(createChallengeMutation)
      .variables(variables);

    // Expect data to be null
    expect(response.data).toBeNull();

    // Expect errors
    const errors = response.errors as any;
    expect(errors).toBeDefined();
    expect(errors[0].message).toContain('Bad Request Exception');
    expect(errors[0].path[0]).toContain('createChallenge');
    expect(errors[0].details.statusCode).toEqual(400);
    expect(errors[0].details.message[0]).toContain('description');
  });
});
