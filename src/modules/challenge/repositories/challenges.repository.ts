import { Challenge } from '../infra/db/entities/challenge';

export abstract class ChallengesRepository {
  abstract create(challenge: Challenge): Promise<void>;
  abstract save(challenge: Challenge): Promise<void>;
  abstract findByTitle(title: string): Promise<Challenge[]>;
  abstract findByDescription(description: string): Promise<Challenge[]>;
  abstract remove(challenge: Challenge): Promise<void>;
}
