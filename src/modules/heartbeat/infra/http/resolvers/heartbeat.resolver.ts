import { HeartbeatService } from '@modules/heartbeat/services/heartbeat.service';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HeartbeatResolver {
  constructor(private readonly heartbeatService: HeartbeatService) {}

  @Query(() => String!)
  heartbeat(): string {
    return this.heartbeatService.execute();
  }
}
