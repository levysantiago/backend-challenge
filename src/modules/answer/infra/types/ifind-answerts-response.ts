import { Answer } from '../db/entities/answer';

export interface IFindAnswersResponse {
  total: number;
  answers: Answer[];
}
