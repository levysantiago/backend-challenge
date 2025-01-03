import { Injectable } from '@nestjs/common';
import { ChallengesRepository } from '../repositories/challenges.repository';
import { ListChallengesError } from '../infra/errors/list-challenges.error';
import { IListChallengesServiceDTO } from './dtos/ilist-challenges-service.dto';
import { IListChallengesServiceResponseDTO } from './dtos/ilist-challenges-service-response.dto';
import { LoggerProvider } from '@shared/providers/logger-provider/types/logger.provider';

@Injectable()
export class ListChallengesService {
  constructor(
    private logger: LoggerProvider,
    private challengesRepository: ChallengesRepository,
  ) {}

  async execute({
    filter,
    page,
    limit,
    orderBy,
  }: IListChallengesServiceDTO): Promise<IListChallengesServiceResponseDTO> {
    try {
      // Find challenges by filter
      const { challenges, total } = await this.challengesRepository.findBy(
        filter,
        {
          page,
          limit,
          orderBy,
        },
      );

      return {
        page,
        limit,
        orderBy,
        total,
        data: challenges,
      };
    } catch (err) {
      this.logger.error(
        `Failed to list challenges: ${err.message}`,
        'ListChallengesService',
      );
      throw new ListChallengesError();
    }
  }
}
