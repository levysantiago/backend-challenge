import { Injectable, Logger } from '@nestjs/common';
import { LoggerProvider } from '../types/logger.provider';

@Injectable()
export class NestjsLoggerProvider implements LoggerProvider {
  private readonly logger = new Logger();

  /**
   * Write a 'log' level log.
   */
  log(message: any, context?: string) {
    this.logger.log(message, context);
  }

  /**
   * Write a 'fatal' level log.
   */
  fatal(message: any, context?: string) {
    this.logger.fatal(message, context);
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, context?: string) {
    this.logger.error(message, context);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, context?: string) {
    this.logger.warn(message, context);
  }

  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, context?: string) {
    this.logger.debug(message, context);
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any, context?: string) {
    this.logger.verbose(message, context);
  }
}
