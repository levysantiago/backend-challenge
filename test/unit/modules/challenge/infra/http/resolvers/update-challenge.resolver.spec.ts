import { IUpdateChallengeServiceResponseDTO } from '@modules/challenge/services/dtos/iupdate-challenge-service-response.dto';
import { UpdateChallengeInput } from '@modules/challenge/infra/http/inputs/update-challenge.input';
import { UpdateChallengeResolver } from '@modules/challenge/infra/http/resolvers/update-challenge.resolver';
import { UpdateChallengeService } from '@modules/challenge/services/update-challenge.service';
import { mock, MockProxy } from 'jest-mock-extended';

describe('UpdateChallengeResolver', () => {
  let sut: UpdateChallengeResolver;
  let updateChallengeService: MockProxy<UpdateChallengeService>;

  const mockResponse: IUpdateChallengeServiceResponseDTO = {
    data: {
      id: '1',
      title: 'Test Challenge',
      description: 'This is a test challenge',
      createdAt: new Date('2024-01-01T00:00:00Z'),
    },
  };

  beforeAll(() => {
    updateChallengeService = mock();
    updateChallengeService.execute.mockResolvedValueOnce(mockResponse);
  });

  beforeEach(async () => {
    sut = new UpdateChallengeResolver(updateChallengeService);
  });

  describe('updateChallenge', () => {
    // Arrange
    const mockInput: UpdateChallengeInput = {
      id: 'fake-id',
      title: 'Test Challenge',
      description: 'This is a test challenge',
    };

    it('should call CreateChallengeService.execute and return the response', async () => {
      // Act
      const result = await sut.updateChallenge(mockInput);

      // Assert
      expect(updateChallengeService.execute).toHaveBeenCalledWith({
        id: mockInput.id,
        data: {
          title: mockInput.title,
          description: mockInput.description,
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
