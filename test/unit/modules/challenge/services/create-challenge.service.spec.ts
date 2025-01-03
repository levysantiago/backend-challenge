import { ICreateChallengeServiceDTO } from '@modules/challenge/services/dtos/icreate-challenge-service.dto';
import { Challenge } from '@modules/challenge/infra/db/entities/challenge';
import { CreateChallengeError } from '@modules/challenge/infra/errors/create-challenge.error';
import { ChallengesRepository } from '@modules/challenge/repositories/challenges.repository';
import { CreateChallengeService } from '@modules/challenge/services/create-challenge.service';
import { mock, MockProxy } from 'jest-mock-extended';
import { LoggerProvider } from '@shared/providers/logger-provider/types/logger.provider';

describe('CreateChallengeService', () => {
  let sut: CreateChallengeService;
  let logger: MockProxy<LoggerProvider>;
  let challengesRepository: MockProxy<ChallengesRepository>;

  beforeAll(() => {
    logger = mock();
    challengesRepository = mock();

    challengesRepository.create.mockResolvedValue();
  });

  beforeEach(() => {
    sut = new CreateChallengeService(logger, challengesRepository);
  });

  describe('execute', () => {
    // Arrange
    const mockData: ICreateChallengeServiceDTO = {
      title: 'Test Challenge',
      description: 'This is a test challenge',
    };

    it('should create a new challenge and persist it', async () => {
      // Act
      const result = await sut.execute(mockData);

      // Assert
      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Challenge);
      expect(result.data.id).toEqual(expect.any(String));
      expect(result.data.title).toEqual(mockData.title);
      expect(result.data.description).toEqual(mockData.description);
      expect(challengesRepository.create).toHaveBeenCalledWith(
        expect.any(Challenge),
      );
    });

    it('should throw CreateChallengeError if repository throws', async () => {
      jest
        .spyOn(challengesRepository, 'create')
        .mockRejectedValueOnce(new Error());

      // Act
      const promise = sut.execute(mockData);

      // Assert
      expect(promise).rejects.toThrow(new CreateChallengeError());
    });
  });
});
