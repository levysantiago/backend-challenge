import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MessagingProvider } from '../types/messaging.provider';
import { ICorrectLessonResponse } from '../dtos/icorrect-lessons-response';
import { LoggerProvider } from '@shared/providers/logger-provider/types/logger.provider';

@Injectable()
export class KafkaMessagingProvider
  implements MessagingProvider, OnModuleInit, OnModuleDestroy
{
  constructor(
    @Inject('MESSAGING_SERVICE_CLIENT') private client: ClientKafka,
    private logger: LoggerProvider,
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('challenge.correction');
    await this.client.connect();
  }

  emitChallengeCorrection(
    message: {
      submissionId: string;
      repositoryUrl: string;
    },
    callbackService: (result: ICorrectLessonResponse) => Promise<void>,
  ) {
    this.client
      .send('challenge.correction', JSON.stringify(message))
      .subscribe({
        next: async (result) => {
          try {
            await callbackService(result);
          } catch (err) {
            this.logger.error(
              `Error in callbackService: ${err.message}`,
              'KafkaMessagingProvider',
            );
          }
        },
        error: (err) => {
          this.logger.error(
            `Error in microservice communication: ${err.message}`,
            'KafkaMessagingProvider',
          );
        },
      });
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}
