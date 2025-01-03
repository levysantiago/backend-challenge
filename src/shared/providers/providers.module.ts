import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database-provider/database.module';
import { MessagingModule } from './messaging-provider/messaging.module';
import { LoggerModule } from './logger-provider/logger.module';

@Global()
@Module({
  imports: [DatabaseModule, MessagingModule, LoggerModule],
})
export class ProvidersModule {}
