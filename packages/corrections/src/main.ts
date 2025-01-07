import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_BROKER_URL],
        },
        consumer: {
          groupId: 'challenge-consumer',
        },
      },
    },
  );

  app.listen(() => console.log('Kafka consumer service is listening!'));
}
bootstrap();
