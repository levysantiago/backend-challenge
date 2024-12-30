import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './database-provider/database.module';
import { QueueModule } from './queue-provider/queue.module';

@Global()
@Module({
  imports: [DatabaseModule, QueueModule],
})
export class ProvidersModule {}
