import { ICreateChallengeServiceResponseDTO } from '@modules/challenge/services/dtos/icreate-challenge-service-response.dto';
import { CreateChallengeInput } from '@modules/challenge/infra/http/inputs/create-challenge.input';
import { CreateChallengeResolver } from '@modules/challenge/infra/http/resolvers/create-challenge.resolver';
import { CreateChallengeService } from '@modules/challenge/services/create-challenge.service';
import { mock, MockProxy } from 'jest-mock-extended';

describe('CreateChallengeResolver', () => {
  let sut: CreateChallengeResolver;
  let createChallengeService: MockProxy<CreateChallengeService>;

  const mockResponse: ICreateChallengeServiceResponseDTO = {
    data: {
      id: '1',
      title: 'Test Challenge',
      description: 'This is a test challenge',
      createdAt: new Date('2024-01-01T00:00:00Z'),
    },
  };

  beforeAll(() => {
    createChallengeService = mock();
    createChallengeService.execute.mockResolvedValueOnce(mockResponse);
  });

  beforeEach(async () => {
    sut = new CreateChallengeResolver(createChallengeService);
  });

  describe('createChallenge', () => {
    it('should call CreateChallengeService.execute and return the response', async () => {
      // Arrange
      const mockInput: CreateChallengeInput = {
        title: 'Test Challenge',
        description: 'This is a test challenge',
      };

      // Act
      const result = await sut.createChallenge(mockInput);

      // Assert
      expect(createChallengeService.execute).toHaveBeenCalledWith(mockInput);
      expect(result).toEqual(mockResponse);
    });
  });
});
