import { AppError } from '@shared/resources/errors/app.error';

export class InternalServerError extends AppError {
  constructor(options: { reason?: string } = {}) {
    super(
      'INTERNAL_SERVER_ERROR',
      'An unexpected error occurred. Please try again later.',
      { ...options },
    );
  }
}
