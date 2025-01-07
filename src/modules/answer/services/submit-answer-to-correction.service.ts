import { Injectable } from '@nestjs/common';
import { ISubmitAnswerToCorrectionServiceDTO } from './dtos/isubmit-answer-to-correction-service.dto';
import { MessagingProvider } from '@shared/providers/messaging-provider/types/messaging.provider';
import { LoggerProvider } from '@shared/providers/logger-provider/types/logger.provider';

@Injectable()
export class SubmitAnswerToCorrectionService {
  constructor(
    private logger: LoggerProvider,
    private readonly messagingProvider: MessagingProvider,
  ) {}

  execute({ answer }: ISubmitAnswerToCorrectionServiceDTO): void {
    try {
      this.messagingProvider.emitChallengeCorrection({
        submissionId: answer.id,
        repositoryUrl: answer.repositoryUrl,
      });
    } catch (err) {
      this.logger.error(
        `Failed to submit answer to correction: ${err.message}`,
        'SubmitAnswerToCorrectionService',
      );
      console.error(err);
    }
  }
}
