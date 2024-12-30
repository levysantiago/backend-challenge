import { AnswerStatus } from '@modules/answer/infra/types/answer-status';

export interface IListAnswersServiceDTO {
  orderBy?: 'asc' | 'desc';
  limit?: number;
  page?: number;

  filter?: {
    challengeId?: string;
    startDate?: Date;
    endDate?: Date;
    status?: AnswerStatus;
  };
}
