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
import { Consumer, Kafka } from 'kafkajs';

@Injectable()
export class KafkaMessagingProvider
  implements MessagingProvider, OnModuleInit, OnModuleDestroy
{
  private consumer: Consumer;

  constructor(
    @Inject('MESSAGING_SERVICE_CLIENT') private client: ClientKafka,
    private logger: LoggerProvider,
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('challenge.correction');
    await this.client.connect();

    // Getting kafka client
    const kafkaClient = this.client['client'] as Kafka;

    // Getting consumer
    this.consumer = kafkaClient.consumer({
      groupId: 'challenge-consumer',
    });

    // Subscribing consumer
    await this.consumer.subscribe({
      topic: 'challenge.correction.reply',
    });
  }

  /**
   * Consumes all messages received on topic challenge.correction.reply
   * @param param0 The callback function that will be executed for each message received
   */
  async consumeChallengeCorrectionResponse({ callbackService }): Promise<void> {
    // Register a response callback
    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        if (topic === 'challenge.correction.reply') {
          try {
            // Parsing JSON to JS object
            const result: ICorrectLessonResponse = JSON.parse(
              message.value.toString(),
            );

            // Calling callback service
            await callbackService(result);
          } catch (err) {
            this.logger.error(
              `Error in callbackService: ${err.message}`,
              'KafkaMessagingProvider',
            );
          }
        }
      },
    });
  }

  /**
   * Emits a new message on topic challenge.correction
   * @param message The message object to be sent
   */
  emitChallengeCorrection(message: {
    submissionId: string;
    repositoryUrl: string;
  }) {
    this.client
      .send('challenge.correction', JSON.stringify(message))
      .subscribe({
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
    await this.consumer.disconnect();
  }
}
