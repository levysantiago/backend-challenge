import { Injectable } from '@nestjs/common';
import { ChallengesRepository } from '../repositories/challenges.repository';
import { ChallengeNotFoundError } from '../infra/errors/challenge-not-found.error';
import { AppError } from '@shared/resources/errors/app.error';
import { IDeleteChallengeServiceResponseDTO } from './dtos/idelete-challenge-service-response.dto';
import { DeleteChallengeError } from '../infra/errors/delete-challenge.error';
import { IDeleteChallengeServiceDTO } from './dtos/idelete-challenge-service.dto';

@Injectable()
export class DeleteChallengeService {
  constructor(private challengesRepository: ChallengesRepository) {}

  async execute({
    id,
  }: IDeleteChallengeServiceDTO): Promise<IDeleteChallengeServiceResponseDTO> {
    try {
      // Deleting challenge
      const challenge = await this.challengesRepository.delete(id);

      // Throw if none challenge were found
      if (!challenge) throw new ChallengeNotFoundError();

      return { data: challenge };
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new DeleteChallengeError();
    }
  }
}
