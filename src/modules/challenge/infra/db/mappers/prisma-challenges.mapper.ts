import { Challenge as RawChallenge } from '@prisma/client';
import { Challenge } from '../entities/challenge';

/**
 * Handles the Challenge entity and Prisma Challenge object castings.
 */
export class PrismaChallengesMapper {
  static toPrisma(challenge: Challenge): RawChallenge {
    return challenge;
  }

  static fromPrisma(rawChallenge: RawChallenge): Challenge {
    return new Challenge(rawChallenge, rawChallenge.id);
  }
}
