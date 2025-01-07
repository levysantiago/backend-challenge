import { Answer } from '@modules/answer/infra/db/entities/answer';

export interface ISubmitAnswerToCorrectionServiceDTO {
  answer: Answer;
}
