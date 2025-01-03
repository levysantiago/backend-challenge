import request from 'supertest-graphql';
import { ExecutionResult } from 'graphql';
import { ObjMap } from 'graphql/jsutils/ObjMap';
import { mockedApp } from '../mocked-app-helper';

describe('Heartbeat (e2e)', () => {
  it('should return "Challenges API running! 🚀" for heartbeat query', async () => {
    // Query
    const query = `
      query {
        heartbeat
      }
    `;

    // Execute route
    const response: ExecutionResult<any, ObjMap<any>> = await request(
      mockedApp.getHttpServer(),
    )
      .query(query)
      .expectNoErrors();

    // Assert
    expect(response.data.heartbeat).toBe('Challenges API running! 🚀');
  });
});
