import { Challenge } from '../entities/challenge';

export interface IFindChallengesResponse {
  total: number;
  challenges: Challenge[];
}
