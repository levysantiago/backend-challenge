import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { QueueProvider } from '../types/queue.provider';
import { ICorrectLessonResponse } from '../dtos/icorrect-lessons-response';

@Injectable()
export class KafkaQueueProvider
  implements QueueProvider, OnModuleInit, OnModuleDestroy
{
  constructor(@Inject('QUEUE_SERVICE_CLIENT') private client: ClientKafka) {}

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
            console.error('[KafkaQueueService] Error in callbackService:', err);
          }
        },
        error: (err) => {
          console.error(
            '[KafkaQueueService] Error in microservice communication:',
            err,
          );
        },
      });
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}
