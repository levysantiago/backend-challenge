import { Injectable } from '@nestjs/common';
import { ISubmitAnswerToCorrectionServiceDTO } from './dtos/isubmit-answer-to-correction-service.dto';
import { MessagingProvider } from '@shared/providers/messaging-provider/types/messaging.provider';

@Injectable()
export class SubmitAnswerToCorrectionService {
  constructor(private readonly messagingProvider: MessagingProvider) {}

  execute({
    answer,
    handleAnswerCorrectionCallback,
  }: ISubmitAnswerToCorrectionServiceDTO): void {
    try {
      this.messagingProvider.emitChallengeCorrection(
        {
          submissionId: answer.id,
          repositoryUrl: answer.repositoryUrl,
        },
        handleAnswerCorrectionCallback,
      );
    } catch (err) {
      console.error(err);
    }
  }
}
