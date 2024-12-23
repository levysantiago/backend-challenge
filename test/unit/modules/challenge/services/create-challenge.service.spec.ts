import { ICreateChallengeDTO } from '@modules/challenge/dtos/icreate-challenge.dto';
import { Challenge } from '@modules/challenge/infra/db/entities/challenge';
import { ChallengesRepository } from '@modules/challenge/repositories/challenges.repository';
import { CreateChallengeService } from '@modules/challenge/services/create-challenge.service';
import { mock, MockProxy } from 'jest-mock-extended';

describe('CreateChallengeService', () => {
  let sut: CreateChallengeService;
  let challengesRepository: MockProxy<ChallengesRepository>;

  beforeAll(() => {
    challengesRepository = mock();

    challengesRepository.create.mockResolvedValue();
  });

  beforeEach(() => {
    sut = new CreateChallengeService(challengesRepository);
  });

  describe('execute', () => {
    it('should create a new challenge and persist it', async () => {
      // Arrange
      const mockData: ICreateChallengeDTO = {
        title: 'Test Challenge',
        description: 'This is a test challenge',
      };

      // Act
      const result = await sut.execute(mockData);

      // Assert
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Challenge);
      expect(result.id).toEqual(expect.any(String));
      expect(result.title).toEqual(mockData.title);
      expect(result.description).toEqual(mockData.description);
      expect(challengesRepository.create).toHaveBeenCalledWith(
        expect.any(Challenge),
      );
    });
  });
});
