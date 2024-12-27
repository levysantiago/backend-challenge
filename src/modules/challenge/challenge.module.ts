import { Module } from '@nestjs/common';
import { ChallengesRepository } from './repositories/challenges.repository';
import { PrismaChallengesRepository } from './infra/db/repositories/prisma-challenges.repository';
import { CreateChallengeService } from './services/create-challenge.service';
import { CreateChallengeResolver } from './infra/http/resolvers/create-challenge.resolver';
import { UpdateChallengeService } from './services/update-challenge.service';
import { UpdateChallengeResolver } from './infra/http/resolvers/update-challenge.resolver';
import { ListChallengesService } from './services/list-challenges.service';
import { ListChallengesResolver } from './infra/http/resolvers/list-challenges.resolver';
import { DeleteChallengeResolver } from './infra/http/resolvers/delete-challenge.resolver';
import { DeleteChallengeService } from './services/delete-challenge.service';

@Module({
  providers: [
    // Repositories
    {
      provide: ChallengesRepository,
      useClass: PrismaChallengesRepository,
    },

    // Services
    CreateChallengeService,
    UpdateChallengeService,
    ListChallengesService,
    DeleteChallengeService,

    // Resolvers
    CreateChallengeResolver,
    UpdateChallengeResolver,
    ListChallengesResolver,
    DeleteChallengeResolver,
  ],
  exports: [ChallengesRepository],
})
export class ChallengeModule {}
