import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { GraphQLHttpExceptionFilter } from '@shared/infra/filters/exception.filter';

export let mockedApp: INestApplication;

export async function createApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  mockedApp = moduleFixture.createNestApplication();

  // Apply the ValidationPipe
  mockedApp.useGlobalPipes(new ValidationPipe());

  // Apply the global exception filter
  mockedApp.useGlobalFilters(new GraphQLHttpExceptionFilter());

  // Enable shutdown hooks
  mockedApp.enableShutdownHooks();

  await mockedApp.init();

  return mockedApp;
}

export async function closeApp(): Promise<void> {
  await mockedApp?.close();
}
