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
export class KafkaQueueService
  implements QueueProvider, OnModuleInit, OnModuleDestroy
{
  constructor(@Inject('QUEUE_SERVICE_CLIENT') private client: ClientKafka) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('challenge.correction');
  }

  emitChallengeCorrection(
    message: {
      submissionId: string;
      repositoryUrl: string;
    },
    callbackService: (result: ICorrectLessonResponse) => void,
  ) {
    this.client
      .send('challenge.correction', JSON.stringify(message))
      .subscribe(callbackService);
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}
