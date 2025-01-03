import { Injectable } from '@nestjs/common';
import { Challenge } from '../infra/db/entities/challenge';
import { ChallengesRepository } from '../repositories/challenges.repository';
import { CreateChallengeError } from '../infra/errors/create-challenge.error';
import { ICreateChallengeServiceDTO } from './dtos/icreate-challenge-service.dto';
import { ICreateChallengeServiceResponseDTO } from './dtos/icreate-challenge-service-response.dto';
import { LoggerProvider } from '@shared/providers/logger-provider/types/logger.provider';

@Injectable()
export class CreateChallengeService {
  constructor(
    private logger: LoggerProvider,
    private challengesRepository: ChallengesRepository,
  ) {}

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
      this.logger.error(
        `Failed to create challenge: ${err.message}`,
        'CreateChallengeService',
      );
      throw new CreateChallengeError();
    }
  }
}
