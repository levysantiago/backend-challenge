import { Injectable } from '@nestjs/common';
import { QueueProvider } from '@shared/providers/queue-provider/types/queue.provider';
import { ISubmitAnswerToCorrectionServiceDTO } from './dtos/isubmit-answer-to-correction-service.dto';

@Injectable()
export class SubmitAnswerToCorrectionService {
  constructor(private readonly queueProvider: QueueProvider) {}

  execute({
    answer,
    handleAnswerCorrectionCallback,
  }: ISubmitAnswerToCorrectionServiceDTO): void {
    try {
      this.queueProvider.emitChallengeCorrection(
        {
          submissionId: answer.id,
          repositoryUrl: answer.repositoryUrl,
        },
        handleAnswerCorrectionCallback,
      );
    } catch (err) {
      console.log(err);
    }
  }
}
