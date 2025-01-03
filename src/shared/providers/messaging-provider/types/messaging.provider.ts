import { ICorrectLessonResponse } from '../dtos/icorrect-lessons-response';

export abstract class MessagingProvider {
  abstract emitChallengeCorrection(
    message: {
      submissionId: string;
      repositoryUrl: string;
    },
    callbackService: (result: ICorrectLessonResponse) => Promise<void>,
  ): void;
}
