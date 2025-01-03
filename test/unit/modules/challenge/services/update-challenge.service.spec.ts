import { IUpdateChallengeServiceDTO } from '@modules/challenge/services/dtos/iupdate-challenge-service.dto';
import { Challenge } from '@modules/challenge/infra/db/entities/challenge';
import { ChallengeNotFoundError } from '@modules/challenge/infra/errors/challenge-not-found.error';
import { UpdateChallengeError } from '@modules/challenge/infra/errors/update-challenge.error';
import { ChallengesRepository } from '@modules/challenge/repositories/challenges.repository';
import { UpdateChallengeService } from '@modules/challenge/services/update-challenge.service';
import { mock, MockProxy } from 'jest-mock-extended';
import { LoggerProvider } from '@shared/providers/logger-provider/types/logger.provider';

describe('UpdateChallengeService', () => {
  let sut: UpdateChallengeService;
  let logger: MockProxy<LoggerProvider>;
  let challengesRepository: MockProxy<ChallengesRepository>;

  const fakeChallenge: Challenge = {
    id: '123',
    title: 'Test Title',
    description: 'Test Description',
    createdAt: new Date(),
  };

  beforeAll(() => {
    logger = mock();
    challengesRepository = mock();

    challengesRepository.save.mockResolvedValue();
    challengesRepository.find.mockResolvedValue(fakeChallenge);
  });

  beforeEach(() => {
    sut = new UpdateChallengeService(logger, challengesRepository);
  });

  describe('execute', () => {
    // Arrange
    const mockData: IUpdateChallengeServiceDTO = {
      id: 'fake-id',
      data: {
        title: 'Test Challenge Updated',
        description: 'This is a test challenge updated',
      },
    };

    it('should update a registered challenge and persist it', async () => {
      // Act
      const result = await sut.execute(mockData);

      // Assert
      expect(result).toBeDefined();
      expect(result.data).toEqual(fakeChallenge);
      expect(challengesRepository.save).toHaveBeenCalledWith({
        ...fakeChallenge,
        title: mockData.data.title,
        description: mockData.data.description,
      });
    });

    it('should throw ChallengeNotFoundError if challenge not found', async () => {
      jest.spyOn(challengesRepository, 'find').mockResolvedValueOnce(null);

      // Act
      const promise = sut.execute(mockData);

      // Assert
      expect(promise).rejects.toThrow(new ChallengeNotFoundError());
    });

    it('should throw UpdateChallengeError if repository throws', async () => {
      jest
        .spyOn(challengesRepository, 'save')
        .mockRejectedValueOnce(new Error());

      // Act
      const promise = sut.execute(mockData);

      // Assert
      expect(promise).rejects.toThrow(new UpdateChallengeError());
    });
  });
});
