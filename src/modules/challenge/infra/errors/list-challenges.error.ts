import { AppError } from '@shared/resources/errors/app.error';

export class ListChallengesError extends AppError {
  constructor(options: { reason?: string } = {}) {
    super(
      'FAILED_TO_LIST_CHALLENGES_ERROR',
      'Failed to list challenges. Please, try again later',
      { ...options },
    );
  }
}
