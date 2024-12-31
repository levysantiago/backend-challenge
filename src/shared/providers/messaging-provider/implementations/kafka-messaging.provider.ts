import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MessagingProvider } from '../types/messaging.provider';
import { ICorrectLessonResponse } from '../dtos/icorrect-lessons-response';

@Injectable()
export class KafkaMessagingProvider
  implements MessagingProvider, OnModuleInit, OnModuleDestroy
{
  constructor(
    @Inject('MESSAGING_SERVICE_CLIENT') private client: ClientKafka,
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
            console.error(
              '[KafkaMessagingProvider] Error in callbackService:',
              err,
            );
          }
        },
        error: (err) => {
          console.error(
            '[KafkaMessagingProvider] Error in microservice communication:',
            err,
          );
        },
      });
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}
