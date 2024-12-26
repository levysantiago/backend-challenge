import { Injectable } from '@nestjs/common';
import { Challenge } from '../infra/db/entities/challenge';
import { ChallengesRepository } from '../repositories/challenges.repository';
import { ICreateChallengeDTO } from '../dtos/icreate-challenge.dto';
import { ICreateChallengeResponseDTO } from '../dtos/icreate-challenge-response.dto';
import { CreateChallengeError } from '../infra/errors/create-challenge.error';

@Injectable()
export class CreateChallengeService {
  constructor(private challengesRepository: ChallengesRepository) {}

  async execute(
    data: ICreateChallengeDTO,
  ): Promise<ICreateChallengeResponseDTO> {
    try {
      // Create new challenge entity
      const challenge = new Challenge(data);
      // Persist challenge
      await this.challengesRepository.create(challenge);
      // Return challenge
      return { data: challenge };
    } catch (err) {
      throw new CreateChallengeError();
    }
  }
}