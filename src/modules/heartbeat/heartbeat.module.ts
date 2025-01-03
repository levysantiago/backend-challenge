import { Module } from '@nestjs/common';
import { HeartbeatService } from './services/heartbeat.service';
import { HeartbeatResolver } from './infra/http/resolvers/heartbeat.resolver';
@Module({
  providers: [
    // Services
    HeartbeatService,

    // Resolvers
    HeartbeatResolver,
  ],
})
export class HeartbeatModule {}
