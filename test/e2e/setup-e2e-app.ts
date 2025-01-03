import { closeApp, createApp } from './mocked-app-helper';

beforeAll(async () => {
  await createApp();
}, 10000);

afterAll(async () => {
  await closeApp();
}, 10000);
