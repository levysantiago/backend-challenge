import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { GraphQLHttpExceptionFilter } from '@shared/infra/filters/exception.filter';
import { LoggerProvider } from '@shared/providers/logger-provider/types/logger.provider';

export let mockedApp: INestApplication;

export async function createApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
    providers: [
      {
        provide: LoggerProvider,
        useValue: {
          log: jest.fn(),
          fatal: jest.fn(),
          warn: jest.fn(),
          debug: jest.fn(),
          error: jest.fn(),
          verbose: jest.fn(),
        },
      },
    ],
  }).compile();

  mockedApp = moduleFixture.createNestApplication();

  // Apply the ValidationPipe
  mockedApp.useGlobalPipes(new ValidationPipe());

  // Get logger
  const logger = mockedApp.get(LoggerProvider);

  // Apply the global exception filter
  mockedApp.useGlobalFilters(new GraphQLHttpExceptionFilter(logger));

  // Enable shutdown hooks
  mockedApp.enableShutdownHooks();

  await mockedApp.init();

  return mockedApp;
}

export async function closeApp(): Promise<void> {
  await mockedApp?.close();
}
