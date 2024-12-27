import { Injectable } from '@nestjs/common';

@Injectable()
export class HeartbeatService {
  execute(): string {
    return 'Challenges API running! 🚀';
  }
}
