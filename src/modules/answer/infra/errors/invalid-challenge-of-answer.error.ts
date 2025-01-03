import { AppError } from '@shared/resources/errors/app.error';

export class InvalidChallengeOfAnswerError extends AppError {
  constructor(options: { reason?: string } = {}) {
    super(
      'INVALID_CHALLENGE_OF_ANSWER_ERROR',
      'Invalid challenge of answer sent. Please, verify if the challenge really exists.',
      { ...options },
    );
  }
}
