import { AppError } from '@shared/resources/errors/app.error';

export class AnswerChallengeError extends AppError {
  constructor(options: { reason?: string } = {}) {
    super(
      'ANSWER_CHALLENGE_ERROR',
      'Failed to answer challenge. Please, try again later',
      { ...options },
    );
  }
}
