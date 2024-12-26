import { Answer } from '../entities/answer';
import { Answer as RawAnswer } from '@prisma/client';

/**
 * Handles the Answer entity and Prisma Answer object castings.
 */
export class PrismaAnswersMapper {
  static toPrisma(challenge: Answer): RawAnswer {
    return challenge;
  }

  static fromPrisma(rawAnswer: RawAnswer): Answer {
    return new Answer(rawAnswer, rawAnswer.id);
  }
}
