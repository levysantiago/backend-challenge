import { Answer } from '@modules/answer/infra/db/entities/answer';
import { ICorrectLessonResponse } from '@shared/providers/messaging-provider/dtos/icorrect-lessons-response';

export interface ISubmitAnswerToCorrectionServiceDTO {
  answer: Answer;
  handleAnswerCorrectionCallback: (
    data: ICorrectLessonResponse,
  ) => Promise<void>;
}
