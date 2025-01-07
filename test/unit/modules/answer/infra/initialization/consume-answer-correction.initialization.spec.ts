import { LoggerProvider } from '@shared/providers/logger-provider/types/logger.provider';
import { MessagingProvider } from '@shared/providers/messaging-provider/types/messaging.provider';
import { UpdateAnswerService } from '@modules/answer/services/update-answer.service';
import { ConsumeAnswerCorrectionInitialization } from '@modules/answer/infra/initialization/consume-answer-correction.initialization';
import { mock, MockProxy } from 'jest-mock-extended';
import { ICorrectLessonResponse } from '@shared/providers/messaging-provider/dtos/icorrect-lessons-response';
import { InternalServerError } from '@shared/infra/errors/internal-server.error';

describe('ConsumeAnswerCorrectionInitialization', () => {
  let sut: ConsumeAnswerCorrectionInitialization;
  let logger: MockProxy<LoggerProvider>;
  let messagingProvider: MockProxy<MessagingProvider>;
  let updateAnswerService: MockProxy<UpdateAnswerService>;

  const mockResult: ICorrectLessonResponse = {
    submissionId: '123',
    repositoryUrl: 'https://repo.com',
    grade: 8,
    status: 'Done',
  };

  beforeEach(() => {
    // Mock LoggerProvider
    logger = mock();

    // Mock MessagingProvider
    messagingProvider = mock();
    messagingProvider.consumeChallengeCorrectionResponse.mockImplementation(
      async ({ callbackService }) => {
        await callbackService(mockResult);
      },
    );

    // Mock UpdateAnswerService
    updateAnswerService = mock();
    updateAnswerService.execute.mockResolvedValue({ data: {} as any });

    // Initialize the service
    sut = new ConsumeAnswerCorrectionInitialization(
      logger,
      messagingProvider,
      updateAnswerService,
    );
  });

  it('should call messagingProvider.consumeChallengeCorrectionResponse with right parameters', async () => {
    // Execute the service
    await sut.onModuleInit();

    // Assertions
    expect(
      messagingProvider.consumeChallengeCorrectionResponse,
    ).toHaveBeenCalledWith({ callbackService: expect.any(Function) });
  });

  it('should call updateAnswerService.execute with right parameters', async () => {
    // Execute the service
    await sut.onModuleInit();

    // Assertions
    expect(updateAnswerService.execute).toHaveBeenCalledWith({
      id: mockResult.submissionId,
      data: {
        grade: mockResult.grade,
        status: mockResult.status,
      },
    });
  });

  it('should throw error if consumeChallengeCorrectionResponse throws', async () => {
    messagingProvider.consumeChallengeCorrectionResponse.mockRejectedValueOnce(
      new Error('unknown'),
    );

    // Execute the service
    const promise = sut.onModuleInit();

    // Assertions
    expect(promise).rejects.toThrow(InternalServerError);
    promise.catch(() => {
      expect(logger.error).toHaveBeenCalledWith(
        'Error on start consuming Kafka messages.',
        'ConsumeAnswerCorrectionInitialization',
      );
    });
  });
});
