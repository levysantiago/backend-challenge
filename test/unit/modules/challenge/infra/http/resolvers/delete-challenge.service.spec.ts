import { IDeleteChallengeResponseDTO } from '@modules/challenge/dtos/idelete-challenge-response.dto';
import { DeleteChallengeInput } from '@modules/challenge/infra/http/inputs/delete-challenge.input';
import { DeleteChallengeResolver } from '@modules/challenge/infra/http/resolvers/delete-challenge.resolver';
import { DeleteChallengeService } from '@modules/challenge/services/delete-challenge.service';
import { mock, MockProxy } from 'jest-mock-extended';

describe('DeleteChallengeResolver', () => {
  let sut: DeleteChallengeResolver;
  let deleteChallengeService: MockProxy<DeleteChallengeService>;

  const mockResponse: IDeleteChallengeResponseDTO = {
    data: {
      id: '1',
      title: 'Test Challenge',
      description: 'This is a test challenge',
      createdAt: new Date('2024-01-01T00:00:00Z'),
    },
  };

  beforeAll(() => {
    deleteChallengeService = mock();
    deleteChallengeService.execute.mockResolvedValueOnce(mockResponse);
  });

  beforeEach(async () => {
    sut = new DeleteChallengeResolver(deleteChallengeService);
  });

  describe('deleteChallenge', () => {
    it('should call CreateChallengeService.delete and return the response', async () => {
      // Arrange
      const mockInput: DeleteChallengeInput = {
        id: 'fake_id',
      };
      // Act
      const result = await sut.deleteChallenge(mockInput);
      // Assert
      expect(deleteChallengeService.execute).toHaveBeenCalledWith(mockInput);
      expect(result).toEqual(mockResponse);
    });
  });
});
