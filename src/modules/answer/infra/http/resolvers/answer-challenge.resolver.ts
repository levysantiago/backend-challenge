import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AnswerChallengeService } from '@modules/answer/services/answer-challenge.service';
import { AnswerResponseDataModel } from '../models/answer-response-data.model';
import { AnswerModel } from '../models/answer.model';
import { AnswerChallengeInput } from '../inputs/answer-challenge.input';
import { SubmitAnswerToCorrectionService } from '@modules/answer/services/submit-answer-to-correction.service';

@Resolver(() => AnswerModel)
export class AnswerChallengeResolver {
  constructor(
    private readonly answerChallengeService: AnswerChallengeService,
    private readonly submitAnswerToCorrectionService: SubmitAnswerToCorrectionService,
  ) {}

  @Mutation(() => AnswerResponseDataModel)
  async answerChallenge(
    @Args('answerChallengeData') answerChallengeData: AnswerChallengeInput,
  ): Promise<AnswerResponseDataModel> {
    // Execute service
    const responseData = await this.answerChallengeService.execute({
      challengeId: answerChallengeData.challengeId,
      repositoryUrl: answerChallengeData.repositoryUrl,
    });

    // Submit answer to correction
    this.submitAnswerToCorrectionService.execute({
      answer: responseData.data,
    });

    return responseData;
  }
}
