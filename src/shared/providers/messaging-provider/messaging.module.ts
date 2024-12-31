import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { MessagingProvider } from './types/messaging.provider';
import { KafkaMessagingProvider } from './implementations/kafka-messaging.provider';

@Global()
@Module({
  imports: [
    // Configure Kafka
    ClientsModule.register([
      {
        name: 'MESSAGING_SERVICE_CLIENT',
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
  providers: [{ provide: MessagingProvider, useClass: KafkaMessagingProvider }],
  exports: [MessagingProvider],
})
export class MessagingModule {}
