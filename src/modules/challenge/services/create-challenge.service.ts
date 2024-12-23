import { Injectable } from '@nestjs/common';
import { ICreateChallengeDTO } from '../dtos/icreate-challenge.dto';
import { Challenge } from '../infra/db/entities/challenge';
import { ChallengesRepository } from '../repositories/challenges.repository';

@Injectable()
export class CreateChallengeService {
  constructor(private challengesRepository: ChallengesRepository) {}

  async execute(data: ICreateChallengeDTO): Promise<Challenge> {
    // Create new challenge entity
    const challenge = new Challenge(data);
    // Persist challenge
    await this.challengesRepository.create(challenge);
    // Return challenge
    return challenge;
  }
}
