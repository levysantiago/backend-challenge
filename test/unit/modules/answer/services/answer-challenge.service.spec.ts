import { Answer } from '@modules/answer/infra/db/entities/answer';
import { AnswerChallengeError } from '@modules/answer/infra/errors/answer-challenge.error';
import { InvalidChallengeOfAnswerError } from '@modules/answer/infra/errors/invalid-challenge-of-answer.error';
import { InvalidRepositoryUrlError } from '@modules/answer/infra/errors/invalid-repository-url.error';
import { AnswersRepository } from '@modules/answer/repositories/answers.repository';
import { AnswerChallengeService } from '@modules/answer/services/answer-challenge.service';
import { IAnswerChallengeServiceDTO } from '@modules/answer/services/dtos/ianswer-challenge-service.dto';
import { ChallengesRepository } from '@modules/challenge/repositories/challenges.repository';
import { GitHubUrlHelper } from '@shared/resources/helpers/github-url.helper';
import { mock, MockProxy } from 'jest-mock-extended';

describe('AnswerChallengeService', () => {
  let sut: AnswerChallengeService;
  let answersRepository: MockProxy<AnswersRepository>;
  let challengesRepository: MockProxy<ChallengesRepository>;

  const fakeChallenge = {
    id: 'fake_challenge_id',
    title: 'Title 1',
    description: 'Description 1',
    createdAt: new Date(),
  };

  beforeAll(() => {
    challengesRepository = mock();
    answersRepository = mock();

    // Mock ChallengesRepository
    challengesRepository.find.mockResolvedValue(fakeChallenge);

    // Mock GitHubUrlHelper
    jest.spyOn(GitHubUrlHelper, 'isGithubUrl').mockResolvedValue(true);
  });

  beforeEach(() => {
    sut = new AnswerChallengeService(answersRepository, challengesRepository);
  });

  describe('execute', () => {
    // Arrange
    const mockData: IAnswerChallengeServiceDTO = {
      challengeId: 'fake_challenge_id',
      repositoryUrl: 'fake_repository_url',
    };

    it('should be able to register a new answer', async () => {
      // Act
      const result = await sut.execute(mockData);
      // Assert
      expect(result.data).toBeInstanceOf(Answer);
      expect(result).toEqual({
        data: {
          id: expect.any(String),
          challengeId: fakeChallenge.id,
          repositoryUrl: mockData.repositoryUrl,
          grade: null,
          status: 'PENDING',
          createdAt: expect.any(Date),
          challenge: { title: fakeChallenge.title },
        },
      });
    });

    it('should be able call challengesRepository.find with right parameters', async () => {
      // Act
      await sut.execute(mockData);
      // Assert
      expect(challengesRepository.find).toHaveBeenCalledWith(
        mockData.challengeId,
      );
    });

    it('should be able call answersRepository.create with right parameters', async () => {
      // Act
      await sut.execute(mockData);
      // Assert
      expect(answersRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          challengeId: fakeChallenge.id,
          repositoryUrl: mockData.repositoryUrl,
          grade: null,
          status: 'PENDING',
          createdAt: expect.any(Date),
        }),
      );
    });

    it('should rethrow InvalidChallengeOfAnswerError if challenge does not exists', async () => {
      jest.spyOn(challengesRepository, 'find').mockResolvedValueOnce(null);
      // Act
      const promise = sut.execute(mockData);
      // Assert
      expect(promise).rejects.toThrow(new InvalidChallengeOfAnswerError());
    });

    it('should rethrow InvalidRepositoryUrlError if challenge does not exists', async () => {
      jest.spyOn(GitHubUrlHelper, 'isGithubUrl').mockResolvedValueOnce(false);
      // Act
      const promise = sut.execute(mockData);
      // Assert
      expect(promise).rejects.toThrow(new InvalidRepositoryUrlError());
    });

    it('should throw AnswerChallengeError if repository throws', async () => {
      jest
        .spyOn(answersRepository, 'create')
        .mockRejectedValueOnce(new Error('unknown'));
      // Act
      const promise = sut.execute(mockData);
      // Assert
      expect(promise).rejects.toThrow(new AnswerChallengeError());
    });
  });
});
