import { Injectable } from '@nestjs/common';
import { ChallengesRepository } from '../repositories/challenges.repository';
import { IUpdateChallengeDTO } from '../dtos/iupdate-challenge.dto';
import { ChallengeNotFoundError } from '../infra/errors/challenge-not-found.error';
import { UpdateChallengeError } from '../infra/errors/update-challenge.error';
import { AppError } from '@shared/resources/errors/app.error';
import { IUpdateChallengeResponseDTO } from '../dtos/iupdate-challenge-response.dto';

@Injectable()
export class UpdateChallengeService {
  constructor(private challengesRepository: ChallengesRepository) {}

  async execute({
    id,
    data,
  }: IUpdateChallengeDTO): Promise<IUpdateChallengeResponseDTO> {
    try {
      // Check if challenge exists in db
      const challenge = await this.challengesRepository.find(id);
      if (!challenge) throw new ChallengeNotFoundError();

      // Update challenge data
      data.title ? (challenge.title = data.title) : undefined;
      data.description ? (challenge.description = data.description) : undefined;

      // Persist challenge updates
      await this.challengesRepository.save(challenge);

      // Return challenge
      return { data: challenge };
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new UpdateChallengeError();
    }
  }
}
