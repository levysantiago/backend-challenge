import { AppError } from '@shared/resources/errors/app.error';

export class UpdateChallengeError extends AppError {
  constructor(options: { reason?: string } = {}) {
    super(
      'UPDATE_CHALLENGE_ERROR',
      'Failed to update challenge. Please, try again later',
      { ...options },
    );
  }
}
