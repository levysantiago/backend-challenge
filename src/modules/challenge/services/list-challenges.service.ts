import { Injectable } from '@nestjs/common';
import { ChallengesRepository } from '../repositories/challenges.repository';
import { IListChallengesDTO } from '../dtos/ilist-challenges.dto';
import { IListChallengesResponseDTO } from '../dtos/ilist-challenges-response.dto';
import { ListChallengesError } from '../infra/errors/list-challenges.error';

@Injectable()
export class ListChallengesService {
  constructor(private challengesRepository: ChallengesRepository) {}

  async execute({
    filter,
    page,
    limit,
    orderBy,
  }: IListChallengesDTO): Promise<IListChallengesResponseDTO> {
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
      throw new ListChallengesError();
    }
  }
}
