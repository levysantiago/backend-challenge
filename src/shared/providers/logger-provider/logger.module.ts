import { Global, Module } from '@nestjs/common';
import { LoggerProvider } from './types/logger.provider';
import { NestjsLoggerProvider } from './implementations/nestjs-logger.provider';

@Global()
@Module({
  imports: [],
  providers: [{ provide: LoggerProvider, useClass: NestjsLoggerProvider }],
  exports: [LoggerProvider],
})
export class LoggerModule {}
