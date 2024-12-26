import { Injectable } from '@nestjs/common';
import { ChallengesRepository } from '../repositories/challenges.repository';
import { IDeleteChallengeDTO } from '../dtos/idelete-challenge.dto';
import { ChallengeNotFoundError } from '../infra/errors/challenge-not-found.error';
import { AppError } from '@shared/resources/errors/app.error';
import { IDeleteChallengeResponseDTO } from '../dtos/idelete-challenge-response.dto';
import { DeleteChallengeError } from '../infra/errors/delete-challenge.error';

@Injectable()
export class DeleteChallengeService {
  constructor(private challengesRepository: ChallengesRepository) {}

  async execute({
    id,
  }: IDeleteChallengeDTO): Promise<IDeleteChallengeResponseDTO> {
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
