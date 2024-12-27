import { Answer } from '../entities/answer';
import { Answer as RawAnswer } from '@prisma/client';

/**
 * Handles the Answer entity and Prisma Answer object castings.
 */
export class PrismaAnswersMapper {
  static toPrisma(answer: Answer): RawAnswer {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { challenge, ...rawAnswer } = answer;
    return rawAnswer;
  }

  static fromPrisma(rawAnswer: RawAnswer): Answer {
    return new Answer(rawAnswer, rawAnswer.id);
  }
}
