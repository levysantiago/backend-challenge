import { AppError } from '@shared/resources/errors/app.error';

export class CreateChallengeError extends AppError {
  constructor(options: { reason?: string } = {}) {
    super(
      'CREATE_CHALLENGE_ERROR',
      'Failed to create challenge. Please, try again later',
      {
        ...options,
      },
    );
  }
}
