import { AnswerChallengeInput } from '@modules/answer/infra/http/inputs/answer-challenge.input';
import { AnswerChallengeResolver } from '@modules/answer/infra/http/resolvers/answer-challenge.resolver';
import { AnswerChallengeService } from '@modules/answer/services/answer-challenge.service';
import { IAnswerChallengeServiceResponseDTO } from '@modules/answer/services/dtos/ianswer-challenge-service-response.dto';
import { mock, MockProxy } from 'jest-mock-extended';

describe('AnswerChallengeResolver', () => {
  let sut: AnswerChallengeResolver;
  let answerChallengeService: MockProxy<AnswerChallengeService>;

  const mockResponse: IAnswerChallengeServiceResponseDTO = {
    data: {
      id: '1',
      challengeId: 'fake_challenge_id',
      repositoryUrl: 'fake_repository_url',
      status: 'PENDING',
      challenge: {
        title: 'fake_title',
      },
      grade: null,
      createdAt: new Date('2024-01-01T00:00:00Z'),
    },
  };

  beforeAll(() => {
    answerChallengeService = mock();
    answerChallengeService.execute.mockResolvedValueOnce(mockResponse);
  });

  beforeEach(async () => {
    sut = new AnswerChallengeResolver(answerChallengeService);
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
  });
});
