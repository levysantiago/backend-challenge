import { IDeleteChallengeDTO } from '@modules/challenge/dtos/idelete-challenge.dto';
import { Challenge } from '@modules/challenge/infra/db/entities/challenge';
import { DeleteChallengeError } from '@modules/challenge/infra/errors/delete-challenge.error';
import { ChallengesRepository } from '@modules/challenge/repositories/challenges.repository';
import { DeleteChallengeService } from '@modules/challenge/services/delete-challenge.service';
import { mock, MockProxy } from 'jest-mock-extended';

describe('DeleteChallengeService', () => {
  let sut: DeleteChallengeService;
  let challengesRepository: MockProxy<ChallengesRepository>;

  const fakeChallenge: Challenge = {
    id: '123',
    title: 'Test Title',
    description: 'Test Description',
    createdAt: new Date(),
  };

  beforeAll(() => {
    challengesRepository = mock();

    challengesRepository.delete.mockResolvedValue(fakeChallenge);
  });

  beforeEach(() => {
    sut = new DeleteChallengeService(challengesRepository);
  });

  describe('execute', () => {
    // Arrange
    const mockData: IDeleteChallengeDTO = {
      id: 'fake_id',
    };

    it('should be able to delete a challenge', async () => {
      // Act
      const result = await sut.execute(mockData);
      // Assert
      expect(result).toEqual({ data: fakeChallenge });
    });

    it('should be able to call challengesRepository.delete with right parameters', async () => {
      // Act
      await sut.execute(mockData);
      // Assert
      expect(challengesRepository.delete).toHaveBeenCalledWith('fake_id');
    });

    it('should throw CreateChallengeError if repository throws', async () => {
      jest
        .spyOn(challengesRepository, 'delete')
        .mockRejectedValueOnce(new Error());
      // Act
      const promise = sut.execute(mockData);
      // Assert
      expect(promise).rejects.toThrow(new DeleteChallengeError());
    });
  });
});
