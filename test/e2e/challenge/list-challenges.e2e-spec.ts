import request from 'supertest-graphql';
import { ExecutionResult } from 'graphql';
import { ObjMap } from 'graphql/jsutils/ObjMap';
import { mockedApp } from '../mocked-app-helper';

describe('List Challenges (e2e)', () => {
  beforeAll(async () => {
    // Create multiple challenges for listing
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

    const challengesToCreate = [
      { title: 'Challenge 1', description: 'First Challenge' },
      { title: 'Challenge 2', description: 'Second Challenge' },
      { title: 'Challenge 3', description: 'Third Challenge' },
    ];

    for (const challenge of challengesToCreate) {
      await request(mockedApp.getHttpServer())
        .mutate(createChallengeMutation)
        .variables({ newChallengeData: challenge })
        .expectNoErrors();
    }
  });

  it('should list challenges with pagination', async () => {
    const listChallengesQuery = `
      query ListChallenges($listChallengesData: ListChallengesInput!) {
        listChallenges(listChallengesData: $listChallengesData) {
          page
          limit
          total
          orderBy
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
      listChallengesData: {
        page: 1,
        limit: 2,
        orderBy: 'asc',
      },
    };

    const response: ExecutionResult<any, ObjMap<any>> = await request(
      mockedApp.getHttpServer(),
    )
      .query(listChallengesQuery)
      .variables(variables)
      .expectNoErrors();

    const responseData = response.data.listChallenges;

    // Assert pagination
    expect(responseData).toBeDefined();
    expect(responseData.page).toBe(1);
    expect(responseData.limit).toBe(2);
    expect(responseData.total).toBeGreaterThanOrEqual(3); // Ensure we have at least 3 challenges
    expect(responseData.data).toHaveLength(2);

    // Assert data
    expect(responseData.data[0].title).toBe('Challenge 1');
    expect(responseData.data[1].title).toBe('Challenge 2');
  });

  it('should filter challenges by title', async () => {
    const listChallengesQuery = `
      query ListChallenges($listChallengesData: ListChallengesInput!) {
        listChallenges(listChallengesData: $listChallengesData) {
          page
          limit
          total
          orderBy
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
      listChallengesData: {
        filter: {
          title: 'Challenge 2',
        },
        page: 1,
        limit: 10,
      },
    };

    const response: ExecutionResult<any, ObjMap<any>> = await request(
      mockedApp.getHttpServer(),
    )
      .query(listChallengesQuery)
      .variables(variables)
      .expectNoErrors();

    const responseData = response.data.listChallenges;

    // Assert filtered data
    expect(responseData).toBeDefined();
    expect(responseData.total).toBe(1);
    expect(responseData.data).toHaveLength(1);
    expect(responseData.data[0].title).toBe('Challenge 2');
  });

  it('should return validation error if page is less than 1', async () => {
    const listChallengesQuery = `
      query ListChallenges($listChallengesData: ListChallengesInput!) {
        listChallenges(listChallengesData: $listChallengesData) {
          page
          limit
          total
          orderBy
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
      listChallengesData: {
        page: 0,
        limit: 10,
      },
    };

    const response = await request(mockedApp.getHttpServer())
      .query(listChallengesQuery)
      .variables(variables);

    // Expect data to be null
    expect(response.data).toBeNull();

    // Expect errors
    const errors = response.errors as any;
    expect(errors).toBeDefined();
    expect(errors[0].message).toContain('Bad Request Exception');
    expect(errors[0].details.message[0]).toContain(
      'page must not be less than 1',
    );
  });
});
