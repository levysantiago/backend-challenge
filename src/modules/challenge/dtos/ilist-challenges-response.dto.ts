import { Challenge } from '@modules/challenge/infra/db/entities/challenge';

export interface IListChallengesResponseDTO {
  page: number;
  limit: number;
  orderBy: 'asc' | 'desc';
  total: number;
  data: Challenge[];
}
