import { Injectable } from '@nestjs/common';
import { Challenge } from '../infra/db/entities/challenge';
import { ChallengesRepository } from '../repositories/challenges.repository';
import { CreateChallengeError } from '../infra/errors/create-challenge.error';
import { ICreateChallengeServiceDTO } from './dtos/icreate-challenge-service.dto';
import { ICreateChallengeServiceResponseDTO } from './dtos/icreate-challenge-service-response.dto';

@Injectable()
export class CreateChallengeService {
  constructor(private challengesRepository: ChallengesRepository) {}

  async execute(
    data: ICreateChallengeServiceDTO,
  ): Promise<ICreateChallengeServiceResponseDTO> {
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
