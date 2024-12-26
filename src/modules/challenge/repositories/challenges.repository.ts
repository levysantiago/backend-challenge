import { ISearchOptions } from '@shared/infra/db-types/isearch-options';
import { Challenge } from '../infra/db/entities/challenge';
import { IFindChallengesResponse } from '../infra/db/types/ifind-challenges-response';
import { IFindChallengesFilter } from '../infra/db/types/ifind-challenges-filter';

export abstract class ChallengesRepository {
  abstract create(challenge: Challenge): Promise<void>;
  abstract save(challenge: Challenge): Promise<void>;
  abstract find(id: string): Promise<Challenge | null>;
  abstract findBy(
    filter: IFindChallengesFilter,
    options: ISearchOptions,
  ): Promise<IFindChallengesResponse>;
  abstract remove(challenge: Challenge): Promise<void>;
}
