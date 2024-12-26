import { Module } from '@nestjs/common';
import { DateScalar } from '@shared/infra/scalar-types/date.scalar';
import { ChallengesRepository } from './repositories/challenges.repository';
import { PrismaChallengesRepository } from './infra/db/repositories/prisma-challenges.repository';
import { CreateChallengeService } from './services/create-challenge.service';
import { CreateChallengeResolver } from './infra/http/resolvers/create-challenge.resolver';
import { UpdateChallengeService } from './services/update-challenge.service';
import { UpdateChallengeResolver } from './infra/http/resolvers/update-challenge.resolver';

@Module({
  providers: [
    // Scalar
    DateScalar,

    // Repositories
    {
      provide: ChallengesRepository,
      useClass: PrismaChallengesRepository,
    },

    // Services
    CreateChallengeService,
    UpdateChallengeService,

    // Resolvers
    CreateChallengeResolver,
    UpdateChallengeResolver,
  ],
})
export class ChallengeModule {}
