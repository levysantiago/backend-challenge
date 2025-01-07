import { AnswerChallengeInput } from '@modules/answer/infra/http/inputs/answer-challenge.input';
import { AnswerChallengeResolver } from '@modules/answer/infra/http/resolvers/answer-challenge.resolver';
import { AnswerChallengeService } from '@modules/answer/services/answer-challenge.service';
import { IAnswerChallengeServiceResponseDTO } from '@modules/answer/services/dtos/ianswer-challenge-service-response.dto';
import { SubmitAnswerToCorrectionService } from '@modules/answer/services/submit-answer-to-correction.service';
import { mock, MockProxy } from 'jest-mock-extended';

describe('AnswerChallengeResolver', () => {
  let sut: AnswerChallengeResolver;
  let answerChallengeService: MockProxy<AnswerChallengeService>;
  let submitAnswerToCorrectionService: MockProxy<SubmitAnswerToCorrectionService>;

  const mockResponse: IAnswerChallengeServiceResponseDTO = {
    data: {
      id: '1',
      challengeId: 'fake_challenge_id',
      repositoryUrl: 'fake_repository_url',
      status: 'Pending',
      challenge: {
        title: 'fake_title',
      },
      grade: null,
      createdAt: new Date('2024-01-01T00:00:00Z'),
    },
  };

  beforeAll(() => {
    answerChallengeService = mock();
    submitAnswerToCorrectionService = mock();

    // Mock AnswerChallengeService
    answerChallengeService.execute.mockResolvedValue(mockResponse);
    // Mock SubmitAnswerToCorrectionService
    submitAnswerToCorrectionService.execute.mockReturnValue();
  });

  beforeEach(async () => {
    sut = new AnswerChallengeResolver(
      answerChallengeService,
      submitAnswerToCorrectionService,
    );
  });

  describe('answerChallenge', () => {
    // Arrange
    const mockInput: AnswerChallengeInput = {
      challengeId: 'fake_challenge_id',
      repositoryUrl: 'fake_repository_url',
    };

    it('should be able to register new answer', async () => {
      // Act
      const result = await sut.answerChallenge(mockInput);
      // Assert
      expect(result).toEqual(mockResponse);
    });

    it('should call answerChallengeService.execute with right parameters', async () => {
      // Act
      await sut.answerChallenge(mockInput);
      // Assert
      expect(answerChallengeService.execute).toHaveBeenCalledWith({
        challengeId: mockInput.challengeId,
        repositoryUrl: mockInput.repositoryUrl,
      });
    });

    it('should call submitAnswerToCorrectionService.execute with right parameters', async () => {
      // Act
      await sut.answerChallenge(mockInput);
      // Assert
      expect(submitAnswerToCorrectionService.execute).toHaveBeenCalledWith({
        answer: mockResponse.data,
      });
    });
  });
});
