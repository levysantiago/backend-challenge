import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AnswerChallengeService } from '@modules/answer/services/answer-challenge.service';
import { AnswerResponseDataModel } from '../models/answer-response-data.model';
import { AnswerModel } from '../models/answer.model';
import { AnswerChallengeInput } from '../inputs/answer-challenge.input';

@Resolver(() => AnswerModel)
export class AnswerChallengeResolver {
  constructor(
    private readonly answerChallengeService: AnswerChallengeService,
  ) {}

  @Mutation(() => AnswerResponseDataModel)
  async answerChallenge(
    @Args('answerChallengeData') answerChallengeData: AnswerChallengeInput,
  ): Promise<AnswerResponseDataModel> {
    // Execute service
    return await this.answerChallengeService.execute({
      challengeId: answerChallengeData.challengeId,
      repositoryUrl: answerChallengeData.repositoryUrl,
    });

    // TODO: notify corrections service
    // TODO: update answer 'grade' and 'status'
  }
}
