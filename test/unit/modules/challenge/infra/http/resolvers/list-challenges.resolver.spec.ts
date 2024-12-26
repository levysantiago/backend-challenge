import { IListChallengesResponseDTO } from '@modules/challenge/dtos/ilist-challenges-response.dto';
import { ListChallengesInput } from '@modules/challenge/infra/http/inputs/list-challenges.input';
import { ListChallengesResolver } from '@modules/challenge/infra/http/resolvers/list-challenges.resolver';
import { ListChallengesService } from '@modules/challenge/services/list-challenges.service';
import { mock, MockProxy } from 'jest-mock-extended';

describe('ListChallengeResolver', () => {
  let sut: ListChallengesResolver;
  let listChallengeService: MockProxy<ListChallengesService>;

  const mockResponse: IListChallengesResponseDTO = {
    page: 1,
    limit: 10,
    orderBy: 'asc',
    total: 10,
    data: [
      {
        id: '1',
        title: 'Title 1',
        description: 'Description 1',
        createdAt: new Date(),
      },
      {
        id: '2',
        title: 'Title 2',
        description: 'Description 2',
        createdAt: new Date(),
      },
    ],
  };

  beforeAll(() => {
    listChallengeService = mock();
    listChallengeService.execute.mockResolvedValueOnce(mockResponse);
  });

  beforeEach(async () => {
    sut = new ListChallengesResolver(listChallengeService);
  });

  describe('listChallenges', () => {
    it('should call ListChallengeService.execute and return the response', async () => {
      // Arrange
      const mockInput: ListChallengesInput = {
        filter: {
          title: 'fake_title',
          description: 'fake_description',
        },
        page: 1,
        limit: 10,
        orderBy: 'asc',
      };

      // Act
      const result = await sut.listChallenges(mockInput);

      // Assert
      expect(listChallengeService.execute).toHaveBeenCalledWith(mockInput);
      expect(result).toEqual(mockResponse);
    });
  });
});
