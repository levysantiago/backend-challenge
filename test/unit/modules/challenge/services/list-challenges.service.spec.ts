import { IListChallengesServiceDTO } from '@modules/challenge/services/dtos/ilist-challenges-service.dto';
import { ListChallengesError } from '@modules/challenge/infra/errors/list-challenges.error';
import { ChallengesRepository } from '@modules/challenge/repositories/challenges.repository';
import { ListChallengesService } from '@modules/challenge/services/list-challenges.service';
import { mock, MockProxy } from 'jest-mock-extended';

describe('ListChallengeService', () => {
  let sut: ListChallengesService;
  let challengesRepository: MockProxy<ChallengesRepository>;

  const fakeFindByResponse = {
    total: 10,
    challenges: [
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
    challengesRepository = mock();
    challengesRepository.findBy.mockResolvedValue(fakeFindByResponse);
  });

  beforeEach(() => {
    sut = new ListChallengesService(challengesRepository);
  });

  describe('execute', () => {
    // Arrange
    const mockData: IListChallengesServiceDTO = {
      page: 1,
      limit: 10,
      orderBy: 'asc',
      filter: {
        title: 'fake_title',
        description: 'fake_description',
      },
    };

    it('should be able to find challenges by filter', async () => {
      // Act
      const result = await sut.execute(mockData);

      // Assert
      expect(result).toEqual({
        page: mockData.page,
        limit: mockData.limit,
        orderBy: mockData.orderBy,
        total: fakeFindByResponse.total,
        data: fakeFindByResponse.challenges,
      });
    });

    it('should be able call challengesRepository.findBy with right parameters', async () => {
      // Act
      await sut.execute(mockData);

      // Assert
      expect(challengesRepository.findBy).toHaveBeenCalledWith(
        mockData.filter,
        {
          page: mockData.page,
          limit: mockData.limit,
          orderBy: mockData.orderBy,
        },
      );
    });

    it('should throw ListChallengesError if repository throws', async () => {
      jest
        .spyOn(challengesRepository, 'findBy')
        .mockRejectedValueOnce(new Error());

      // Act
      const promise = sut.execute(mockData);

      // Assert
      expect(promise).rejects.toThrow(new ListChallengesError());
    });
  });
});
