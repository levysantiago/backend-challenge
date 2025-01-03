import { Injectable } from '@nestjs/common';
import { AnswersRepository } from '../repositories/answers.repository';
import { IListAnswersServiceDTO } from './dtos/ilist-answers-service.dto';
import { ListAnswersError } from '../infra/errors/list-answers.error';
import { IListAnswersServiceResponseDTO } from './dtos/ilist-answers-service-response.dto';
import { LoggerProvider } from '@shared/providers/logger-provider/types/logger.provider';

@Injectable()
export class ListAnswersService {
  constructor(
    private logger: LoggerProvider,
    private answersRepository: AnswersRepository,
  ) {}

  async execute({
    filter,
    page,
    limit,
    orderBy,
  }: IListAnswersServiceDTO): Promise<IListAnswersServiceResponseDTO> {
    try {
      // Find answers by filter
      const { answers, total } = await this.answersRepository.findBy(filter, {
        page,
        limit,
        orderBy,
      });

      return {
        page,
        limit,
        orderBy,
        total,
        data: answers,
      };
    } catch (err) {
      this.logger.error(
        `Failed to list answers: ${err.message}`,
        'ListAnswersService',
      );
      throw new ListAnswersError();
    }
  }
}
