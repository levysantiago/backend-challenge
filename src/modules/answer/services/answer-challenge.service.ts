import { Injectable } from '@nestjs/common';
import { AnswersRepository } from '../repositories/answers.repository';
import { ChallengesRepository } from '@modules/challenge/repositories/challenges.repository';
import { IAnswerChallengeServiceDTO } from './dtos/ianswer-challenge-service.dto';
import { IAnswerChallengeServiceResponseDTO } from './dtos/ianswer-challenge-service-response.dto';
import { Answer } from '../infra/db/entities/answer';
import { AnswerChallengeError } from '../infra/errors/answer-challenge.error';
import { InvalidChallengeOfAnswerError } from '../infra/errors/invalid-challenge-of-answer.error';
import { GitHubUrlHelper } from '@shared/resources/helpers/github-url.helper';
import { AppError } from '@shared/resources/errors/app.error';

type IErrorId = 'invalidChallenge' | 'invalidRepositoryUrl';

@Injectable()
export class AnswerChallengeService {
  errors = {
    invalidChallenge: InvalidChallengeOfAnswerError,
    invalidRepositoryUrl: InvalidChallengeOfAnswerError,
  };

  constructor(
    private answersRepository: AnswersRepository,
    private challengesRepository: ChallengesRepository,
  ) {}

  async execute(
    data: IAnswerChallengeServiceDTO,
  ): Promise<IAnswerChallengeServiceResponseDTO> {
    try {
      // Create error id
      let errorId: IErrorId;
      // Finding challenge
      const challenge = await this.challengesRepository.find(data.challengeId);
      // Check if challenge does not exist
      if (!challenge) {
        // Define errorId
        errorId = 'invalidChallenge';
      } else {
        // Check if repository URL is invalid
        const isValidGithubUrl = await GitHubUrlHelper.isGithubUrl(
          data.repositoryUrl,
        );
        if (!isValidGithubUrl) {
          // Define errorId
          errorId = 'invalidRepositoryUrl';
        }
      }

      // Create new answer entity
      const answer = new Answer(data);
      // Check if there is an error
      if (errorId) {
        // Define the status as an error
        answer.status = 'ERROR';
        await this.answersRepository.create(answer);
        throw new this.errors[errorId]();
      }
      // Persist challenge
      await this.answersRepository.create(answer);
      // Add challenge title to answer
      answer.challenge.title = challenge.title;
      // Return challenge
      return { data: answer };
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AnswerChallengeError({ reason: err.message });
    }
  }
}
