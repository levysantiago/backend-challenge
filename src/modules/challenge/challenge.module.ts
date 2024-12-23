import { Module } from '@nestjs/common';
import { DateScalar } from '@shared/infra/scalar-types/date.scalar';
import { ChallengesRepository } from './repositories/challenges.repository';
import { PrismaChallengesRepository } from './infra/db/repositories/prisma-challenges.repository';

@Module({
  providers: [
    DateScalar,
    {
      provide: ChallengesRepository,
      useClass: PrismaChallengesRepository,
    },
  ],
})
export class ChallengeModule {}
