import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GraphQLHttpExceptionFilter } from '@shared/infra/filters/exception.filter';
import { ValidationPipe } from '@nestjs/common';
import './shared/resources/env';
import { LoggerProvider } from '@shared/providers/logger-provider/types/logger.provider';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Enable shutdown hooks
  app.enableShutdownHooks();

  // Apply the filter globally
  const logger = app.get(LoggerProvider);
  app.useGlobalFilters(new GraphQLHttpExceptionFilter(logger));

  await app.listen(3333);
}
bootstrap();
