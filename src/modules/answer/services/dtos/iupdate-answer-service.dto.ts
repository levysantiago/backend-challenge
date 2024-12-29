import { AnswerStatus } from '@modules/answer/infra/types/answer-status';

export interface IUpdateAnswerServiceDTO {
  id: string;
  data: {
    status: AnswerStatus;
    grade: number;
  };
}
