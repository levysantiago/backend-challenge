import { Module } from '@nestjs/common';
import { AnswersRepository } from './repositories/answers.repository';
import { PrismaAnswersRepository } from './infra/db/repositories/prisma-answers.repository';

@Module({
  providers: [
    // Repositories
    {
      provide: AnswersRepository,
      useClass: PrismaAnswersRepository,
    },

    // Services

    // Resolvers
  ],
})
export class AnswerModule {}
