import { Injectable } from '@nestjs/common';
import { AnswersRepository } from '../repositories/answers.repository';
import { AppError } from '@shared/resources/errors/app.error';
import { IUpdateAnswerServiceDTO } from './dtos/iupdate-answer-service.dto';
import { IUpdateAnswerServiceResponseDTO } from './dtos/iupdate-answer-service-response.dto';
import { AnswerNotFoundError } from '../infra/errors/answer-not-found.error';
import { UpdateAnswerError } from '../infra/errors/update-answer.error';
import { LoggerProvider } from '@shared/providers/logger-provider/types/logger.provider';

@Injectable()
export class UpdateAnswerService {
  constructor(
    private logger: LoggerProvider,
    private answersRepository: AnswersRepository,
  ) {}

  async execute({
    id,
    data,
  }: IUpdateAnswerServiceDTO): Promise<IUpdateAnswerServiceResponseDTO> {
    try {
      // Finding answer
      const answer = await this.answersRepository.find(id);
      if (!answer) throw new AnswerNotFoundError();

      // Updating answer
      data.status ? (answer.status = data.status) : undefined;
      data.grade ? (answer.grade = data.grade) : undefined;

      // Persisting updates
      await this.answersRepository.save(answer);

      return { data: answer };
    } catch (err) {
      if (err instanceof AppError) {
        this.logger.error(
          `Failed to update answer: ${err.message}`,
          'UpdateAnswerService',
        );

        throw err;
      }

      this.logger.error(
        `Failed to update answer: ${err.message}`,
        'UpdateAnswerService',
      );
      throw new UpdateAnswerError({ reason: err.message });
    }
  }
}
