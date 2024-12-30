import { AppError } from '@shared/resources/errors/app.error';

export class ListAnswersError extends AppError {
  constructor(options: { reason?: string } = {}) {
    super(
      'LIST_ANSWERS_ERROR',
      'Failed to list answers. Please, try again later.',
      { ...options },
    );
  }
}
