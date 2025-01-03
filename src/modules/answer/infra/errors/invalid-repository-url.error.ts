import { AppError } from '@shared/resources/errors/app.error';

export class InvalidRepositoryUrlError extends AppError {
  constructor(options: { reason?: string } = {}) {
    super(
      'INVALID_REPOSITORY_URL_ERROR',
      'Invalid repository URL. Please, check if you sent the right URL.',
      { ...options },
    );
  }
}
