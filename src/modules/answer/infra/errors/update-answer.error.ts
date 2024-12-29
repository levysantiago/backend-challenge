import { AppError } from '@shared/resources/errors/app.error';

export class UpdateAnswerError extends AppError {
  constructor(options: { reason?: string } = {}) {
    super(
      'UPDATE_ANSWER_ERROR',
      'Failed to update answer. Please, try again later',
      { ...options },
    );
  }
}
