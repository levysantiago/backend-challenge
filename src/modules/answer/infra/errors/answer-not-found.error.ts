import { AppError } from '@shared/resources/errors/app.error';

export class AnswerNotFoundError extends AppError {
  constructor(options: { reason?: string } = {}) {
    super(
      'ANSWER_NOT_FOUND_ERROR',
      'Answer not found, please, verify if you sent the right answer identifier.',
      { ...options },
    );
  }
}
