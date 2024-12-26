import { AnswerStatus } from './answer-status';

export interface IFindAnswersByFilter {
  challengeId?: string;
  startDate?: Date;
  endDate?: Date;
  status?: AnswerStatus;
}
