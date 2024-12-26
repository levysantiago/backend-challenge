import { AppError } from '@shared/resources/errors/app.error';

export class DeleteChallengeError extends AppError {
  constructor(options: { reason?: string } = {}) {
    super(
      'DELETE_CHALLENGE_ERROR',
      'Failed to delete challenge. Please, try again later',
      { ...options },
    );
  }
}
