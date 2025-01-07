import { closeApp, createApp } from './mocked-app-helper';

beforeAll(async () => {
  await createApp();
}, 25000);

afterAll(async () => {
  await closeApp();
}, 20000);
