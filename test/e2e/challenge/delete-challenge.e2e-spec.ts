import request from 'supertest-graphql';
import { ExecutionResult } from 'graphql';
import { ObjMap } from 'graphql/jsutils/ObjMap';
import { mockedApp } from '../mocked-app-helper';
import { randomUUID } from 'node:crypto';

describe('Delete Challenge (e2e)', () => {
  let challengeId: string;

  beforeAll(async () => {
    // Create a challenge to delete
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
        title: 'Challenge to Delete',
        description: 'This challenge will be deleted during the test',
      },
    };

    const response: ExecutionResult<any, ObjMap<any>> = await request(
      mockedApp.getHttpServer(),
    )
      .mutate(createChallengeMutation)
      .variables(variables)
      .expectNoErrors();

    challengeId = response.data.createChallenge.data.id;
  });

  it('should delete the challenge and return the deleted challenge data', async () => {
    // Mutation
    const deleteChallengeMutation = `
      mutation DeleteChallenge($deleteChallengeData: DeleteChallengeInput!) {
        deleteChallenge(deleteChallengeData: $deleteChallengeData) {
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
      deleteChallengeData: {
        id: challengeId,
      },
    };

    // Execute route
    const response: ExecutionResult<any, ObjMap<any>> = await request(
      mockedApp.getHttpServer(),
    )
      .mutate(deleteChallengeMutation)
      .variables(variables)
      .expectNoErrors();

    // Capture data
    const responseData = response.data.deleteChallenge.data;

    // Assert
    expect(responseData).toBeDefined();
    expect(responseData.id).toBe(challengeId);
    expect(responseData.title).toBe('Challenge to Delete');
    expect(responseData.description).toBe(
      'This challenge will be deleted during the test',
    );
  });

  it('should return an error if the challenge does not exist', async () => {
    const deleteChallengeMutation = `
      mutation DeleteChallenge($deleteChallengeData: DeleteChallengeInput!) {
        deleteChallenge(deleteChallengeData: $deleteChallengeData) {
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
      deleteChallengeData: {
        id: randomUUID(),
      },
    };

    const response = await request(mockedApp.getHttpServer())
      .mutate(deleteChallengeMutation)
      .variables(variables);

    // Expect data to be null
    expect(response.data).toBeNull();

    // Expect errors
    const errors = response.errors as any;
    expect(errors).toBeDefined();
    expect(errors[0].message).toContain('Challenge not found');
    expect(errors[0].path[0]).toContain('deleteChallenge');
  });

  it('should return a validation error if id is not a UUID', async () => {
    const deleteChallengeMutation = `
      mutation DeleteChallenge($deleteChallengeData: DeleteChallengeInput!) {
        deleteChallenge(deleteChallengeData: $deleteChallengeData) {
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
      deleteChallengeData: {
        id: 'invalid-id',
      },
    };

    const response = await request(mockedApp.getHttpServer())
      .mutate(deleteChallengeMutation)
      .variables(variables);

    // Expect data to be null
    expect(response.data).toBeNull();

    // Expect errors
    const errors = response.errors as any;
    expect(errors).toBeDefined();
    expect(errors[0].message).toContain('Bad Request Exception');
    expect(errors[0].path[0]).toContain('deleteChallenge');
    expect(errors[0].details.statusCode).toEqual(400);
    expect(errors[0].details.message[0]).toContain('id must be a UUID');
  });
});
