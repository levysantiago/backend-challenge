import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest-graphql';
import { AppModule } from '../../../src/app.module';
import { ExecutionResult } from 'graphql';
import { ObjMap } from 'graphql/jsutils/ObjMap';

describe('Heartbeat (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  }, 10000);

  afterAll(async () => {
    await app.close();
  }, 10000);

  it('should return "Challenges API running! 🚀" for heartbeat query', async () => {
    // Query
    const query = `
      query {
        heartbeat
      }
    `;

    // Execute route
    const response: ExecutionResult<any, ObjMap<any>> = await request(
      app.getHttpServer(),
    )
      .query(query)
      .expectNoErrors();

    // Assert
    expect(response.data.heartbeat).toBe('Challenges API running! 🚀');
  });
});
