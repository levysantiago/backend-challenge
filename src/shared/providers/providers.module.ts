import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database-provider/database.module';
import { MessagingModule } from './messaging-provider/messaging.module';

@Global()
@Module({
  imports: [DatabaseModule, MessagingModule],
})
export class ProvidersModule {}
