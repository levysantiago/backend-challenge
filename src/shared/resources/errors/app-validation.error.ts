import { GraphQLError } from 'graphql';
import { ZodIssue } from 'zod';

export class AppValidationError extends GraphQLError {
  constructor(issues: ZodIssue[]) {
    super('Validation error', {
      extensions: { code: 'VALIDATION_ERROR', details: issues },
    });
  }
}
