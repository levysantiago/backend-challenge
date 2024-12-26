import { AppError } from '@shared/resources/errors/app.error';

export class ChallengeNotFoundError extends AppError {
  constructor(options: { reason?: string } = {}) {
    super(
      'CHALLENGE_NOT_FOUND_ERROR',
      'Challenge not found, please, verify if you sent the right challenge identifier.',
      { ...options },
    );
  }
}
