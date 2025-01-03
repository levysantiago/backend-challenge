import { Answer } from '@modules/answer/infra/db/entities/answer';

export interface IListAnswersServiceResponseDTO {
  page: number;
  limit: number;
  orderBy: 'asc' | 'desc';
  total: number;
  data: Answer[];
}
