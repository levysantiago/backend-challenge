import { UpdateAnswerService } from '@modules/answer/services/update-answer.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InternalServerError } from '@shared/infra/errors/internal-server.error';
import { LoggerProvider } from '@shared/providers/logger-provider/types/logger.provider';
import { ICorrectLessonResponse } from '@shared/providers/messaging-provider/dtos/icorrect-lessons-response';
import { MessagingProvider } from '@shared/providers/messaging-provider/types/messaging.provider';

@Injectable()
export class ConsumeAnswerCorrectionInitialization implements OnModuleInit {
  constructor(
    private readonly logger: LoggerProvider,
    private readonly messagingProvider: MessagingProvider,
    private readonly updateAnswerService: UpdateAnswerService,
  ) {}

  async onModuleInit() {
    try {
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

      this.logger.log(
        'Start consuming challenges correction responses...',
        'ConsumeAnswerCorrectionInitialization',
      );

      // Start consuming messages
      await this.messagingProvider.consumeChallengeCorrectionResponse({
        callbackService: handleAnswerCorrectionCallback,
      });

      this.logger.log(
        'Watching challenges correction responses.',
        'ConsumeAnswerCorrectionInitialization',
      );
    } catch (err) {
      this.logger.error(
        'Error on start consuming Kafka messages.',
        'ConsumeAnswerCorrectionInitialization',
      );
      throw new InternalServerError();
    }
  }
}
