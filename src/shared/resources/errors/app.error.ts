import { GraphQLError } from 'graphql';

export class AppError extends GraphQLError {
  constructor(code: string, message: string, options: { reason?: string }) {
    super(message, {
      extensions: { code, reason: options.reason },
    });
  }
}
