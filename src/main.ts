import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GraphQLHttpExceptionFilter } from '@shared/infra/filters/exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // Apply the filter globally
  app.useGlobalFilters(new GraphQLHttpExceptionFilter());

  await app.listen(3333);
}
bootstrap();
