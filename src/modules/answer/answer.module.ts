import { Module } from '@nestjs/common';
import { AnswersRepository } from './repositories/answers.repository';
import { PrismaAnswersRepository } from './infra/db/repositories/prisma-answers.repository';
import { AnswerChallengeService } from './services/answer-challenge.service';
import { ChallengeModule } from '@modules/challenge/challenge.module';
import { AnswerChallengeResolver } from './infra/http/resolvers/answer-challenge.resolver';

@Module({
  imports: [ChallengeModule],
  providers: [
    // Repositories
    {
      provide: AnswersRepository,
      useClass: PrismaAnswersRepository,
    },

    // Services
    AnswerChallengeService,

    // Resolvers
    AnswerChallengeResolver,
  ],
})
export class AnswerModule {}
