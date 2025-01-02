import request from 'supertest-graphql';
import { ExecutionResult } from 'graphql';
import { ObjMap } from 'graphql/jsutils/ObjMap';
import { mockedApp } from '../mocked-app-helper';

describe('Update Challenge (e2e)', () => {
  let challengeId: string;

  beforeAll(async () => {
    // Create a challenge to update
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
        title: 'Original Title',
        description: 'Original Description',
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

  it('should update the challenge and return the updated data', async () => {
    // Mutation
    const updateChallengeMutation = `
      mutation UpdateChallenge($updateChallengeData: UpdateChallengeInput!) {
        updateChallenge(updateChallengeData: $updateChallengeData) {
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
      updateChallengeData: {
        id: challengeId,
        title: 'Updated Title',
        description: 'Updated Description',
      },
    };

    // Execute route
    const response: ExecutionResult<any, ObjMap<any>> = await request(
      mockedApp.getHttpServer(),
    )
      .mutate(updateChallengeMutation)
      .variables(variables)
      .expectNoErrors();

    // Capture data
    const responseData = response.data.updateChallenge.data;

    // Assert
    expect(responseData).toBeDefined();
    expect(responseData.id).toBe(challengeId);
    expect(responseData.title).toBe(variables.updateChallengeData.title);
    expect(responseData.description).toBe(
      variables.updateChallengeData.description,
    );
  });

  it('should return validation errors if title exceeds max length', async () => {
    const updateChallengeMutation = `
      mutation UpdateChallenge($updateChallengeData: UpdateChallengeInput!) {
        updateChallenge(updateChallengeData: $updateChallengeData) {
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
      updateChallengeData: {
        id: challengeId,
        title: 'This title is way too long for the max length of 30 characters',
      },
    };

    const response = await request(mockedApp.getHttpServer())
      .mutate(updateChallengeMutation)
      .variables(variables);

    // Expect data to be null
    expect(response.data).toBeNull();

    // Expect errors
    const errors = response.errors as any;
    expect(errors).toBeDefined();
    expect(errors[0].message).toContain('Bad Request Exception');
    expect(errors[0].path[0]).toContain('updateChallenge');
    expect(errors[0].details.statusCode).toEqual(400);
    expect(errors[0].details.message[0]).toContain('title');
  });

  it('should return validation errors if description exceeds max length', async () => {
    const updateChallengeMutation = `
      mutation UpdateChallenge($updateChallengeData: UpdateChallengeInput!) {
        updateChallenge(updateChallengeData: $updateChallengeData) {
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
      updateChallengeData: {
        id: challengeId,
        description: `This description is way too long for the max length of 255 characters
          This description is way too long for the max length of 255 characters
          This description is way too long for the max length of 255 characters
          This description is way too long for the max length of 255 characters`,
      },
    };

    const response = await request(mockedApp.getHttpServer())
      .mutate(updateChallengeMutation)
      .variables(variables);

    // Expect data to be null
    expect(response.data).toBeNull();

    // Expect errors
    const errors = response.errors as any;
    expect(errors).toBeDefined();
    expect(errors[0].message).toContain('Bad Request Exception');
    expect(errors[0].path[0]).toContain('updateChallenge');
    expect(errors[0].details.statusCode).toEqual(400);
    expect(errors[0].details.message[0]).toContain('description');
  });

  it('should return an error if the challenge does not exist', async () => {
    const updateChallengeMutation = `
      mutation UpdateChallenge($updateChallengeData: UpdateChallengeInput!) {
        updateChallenge(updateChallengeData: $updateChallengeData) {
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
      updateChallengeData: {
        id: 'non-existent-id',
        title: 'Updated Title',
        description: 'Updated Description',
      },
    };

    const response = await request(mockedApp.getHttpServer())
      .mutate(updateChallengeMutation)
      .variables(variables);

    // Expect data to be null
    expect(response.data).toBeNull();

    // Expect errors
    const errors = response.errors as any;
    expect(errors).toBeDefined();
    expect(errors[0].message).toContain('Challenge not found');
    expect(errors[0].path[0]).toContain('updateChallenge');
  });
});
