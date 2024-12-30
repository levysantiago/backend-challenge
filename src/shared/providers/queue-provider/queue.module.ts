import { Global, Module } from '@nestjs/common';
import { QueueProvider } from './types/queue.provider';
import { KafkaQueueProvider } from './implementations/kafka-queue.provider';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

@Global()
@Module({
  imports: [
    // Configure Kafka
    ClientsModule.register([
      {
        name: 'QUEUE_SERVICE_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'challenge_api',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'challenge-consumer',
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner,
          },
        },
      },
    ]),
  ],
  providers: [{ provide: QueueProvider, useClass: KafkaQueueProvider }],
  exports: [QueueProvider],
})
export class QueueModule {}
