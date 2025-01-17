import { AnswerStatus } from '@modules/answer/infra/types/answer-status';
import { SubmitAnswerToCorrectionService } from '@modules/answer/services/submit-answer-to-correction.service';
import { LoggerProvider } from '@shared/providers/logger-provider/types/logger.provider';
import { MessagingProvider } from '@shared/providers/messaging-provider/types/messaging.provider';
import { mock, MockProxy } from 'jest-mock-extended';

describe('SubmitAnswerToCorrectionService', () => {
  let sut: SubmitAnswerToCorrectionService;
  let logger: MockProxy<LoggerProvider>;
  let messagingProvider: MockProxy<MessagingProvider>;

  beforeAll(() => {
    logger = mock();
    messagingProvider = mock();

    // Mock ChallengesRepository
    messagingProvider.emitChallengeCorrection.mockReturnValue();
  });

  beforeEach(() => {
    sut = new SubmitAnswerToCorrectionService(logger, messagingProvider);
  });

  describe('execute', () => {
    // Arrange
    const mockData = {
      answer: {
        id: '1',
        challengeId: 'fake_challenge_id',
        repositoryUrl: 'fake_repository_url',
        status: 'Pending' as AnswerStatus,
        challenge: {
          title: 'fake_title',
        },
        grade: null,
        createdAt: new Date('2024-01-01T00:00:00Z'),
      },
    };

    it('should be able to submit answer to correction', async () => {
      // Act
      expect(sut.execute(mockData)).toBeUndefined();
    });

    it('should be able call messagingProvider.emitChallengeCorrection with right parameters', async () => {
      // Act
      sut.execute(mockData);
      // Assert
      expect(messagingProvider.emitChallengeCorrection).toHaveBeenCalledWith({
        submissionId: mockData.answer.id,
        repositoryUrl: mockData.answer.repositoryUrl,
      });
    });
  });
});
