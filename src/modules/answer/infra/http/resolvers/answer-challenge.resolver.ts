import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AnswerChallengeService } from '@modules/answer/services/answer-challenge.service';
import { AnswerResponseDataModel } from '../models/answer-response-data.model';
import { AnswerModel } from '../models/answer.model';
import { AnswerChallengeInput } from '../inputs/answer-challenge.input';
import { SubmitAnswerToCorrectionService } from '@modules/answer/services/submit-answer-to-correction.service';
import { UpdateAnswerService } from '@modules/answer/services/update-answer.service';
import { ICorrectLessonResponse } from '@shared/providers/queue-provider/dtos/icorrect-lessons-response';

@Resolver(() => AnswerModel)
export class AnswerChallengeResolver {
  constructor(
    private readonly answerChallengeService: AnswerChallengeService,
    private readonly updateAnswerService: UpdateAnswerService,
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

    // Prepare answer correction handler
    const handleAnswerCorrectionCallback = async (
      result: ICorrectLessonResponse,
    ) => {
      // Update answer after receiving the result as callback
      await this.updateAnswerService.execute({
        id: result.submissionId,
        data: {
          grade: result.grade,
          status: result.status,
        },
      });
    };

    // Submit answer to correction
    this.submitAnswerToCorrectionService.execute({
      answer: responseData.data,
      handleAnswerCorrectionCallback,
    });

    return responseData;
  }
}
