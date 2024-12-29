import { ISearchOptions } from '@shared/infra/db-types/isearch-options';
import { Answer } from '../infra/db/entities/answer';
import { IFindAnswersResponse } from '../infra/types/ifind-answerts-response';
import { IFindAnswersByFilter } from '../infra/types/ifind-answers-by-filter';

export abstract class AnswersRepository {
  abstract create(answer: Answer): Promise<void>;
  abstract save(answer: Answer): Promise<void>;
  abstract find(id: string): Promise<Answer | null>;
  abstract findBy(
    filter: IFindAnswersByFilter,
    options: ISearchOptions,
  ): Promise<IFindAnswersResponse>;
}
