import { AnswerStatus } from '../../types/answer-status';

export interface ICreateAnswerEntityDTO {
  challengeId: string;
  repositoryUrl: string;
  status?: AnswerStatus;
  grade?: number;
  createdAt?: Date;
}
