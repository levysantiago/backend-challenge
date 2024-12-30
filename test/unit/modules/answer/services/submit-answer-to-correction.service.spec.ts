import { AnswerStatus } from '@modules/answer/infra/types/answer-status';
import { SubmitAnswerToCorrectionService } from '@modules/answer/services/submit-answer-to-correction.service';
import { QueueProvider } from '@shared/providers/queue-provider/types/queue.provider';
import { mock, MockProxy } from 'jest-mock-extended';

describe('SubmitAnswerToCorrectionService', () => {
  let sut: SubmitAnswerToCorrectionService;
  let queueProvider: MockProxy<QueueProvider>;

  beforeAll(() => {
    queueProvider = mock();

    // Mock ChallengesRepository
    queueProvider.emitChallengeCorrection.mockReturnValue();
  });

  beforeEach(() => {
    sut = new SubmitAnswerToCorrectionService(queueProvider);
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
      handleAnswerCorrectionCallback: jest.fn(),
    };

    it('should be able to submit answer to correction', async () => {
      // Act
      expect(sut.execute(mockData)).toBeUndefined();
    });

    it('should be able call queueProvider.emitChallengeCorrection with right parameters', async () => {
      // Act
      sut.execute(mockData);
      // Assert
      expect(queueProvider.emitChallengeCorrection).toHaveBeenCalledWith(
        {
          submissionId: mockData.answer.id,
          repositoryUrl: mockData.answer.repositoryUrl,
        },
        mockData.handleAnswerCorrectionCallback,
      );
    });
  });
});
