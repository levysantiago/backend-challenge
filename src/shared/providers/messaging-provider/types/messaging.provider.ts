import { ICorrectLessonResponse } from '../dtos/icorrect-lessons-response';

export abstract class MessagingProvider {
  abstract emitChallengeCorrection(message: {
    submissionId: string;
    repositoryUrl: string;
  }): void;

  abstract consumeChallengeCorrectionResponse({
    callbackService,
  }: {
    callbackService: (result: ICorrectLessonResponse) => Promise<void>;
  }): Promise<void>;
}
