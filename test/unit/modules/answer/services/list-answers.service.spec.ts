import { mock, MockProxy } from 'jest-mock-extended';
import { ListAnswersService } from '@modules/answer/services/list-answers.service';
import { AnswersRepository } from '@modules/answer/repositories/answers.repository';
import { AnswerStatus } from '@modules/answer/infra/types/answer-status';
import { IListAnswersServiceDTO } from '@modules/answer/services/dtos/ilist-answers-service.dto';
import { ListAnswersError } from '@modules/answer/infra/errors/list-answers.error';

describe('ListAnswersService', () => {
  let sut: ListAnswersService;
  let answersRepository: MockProxy<AnswersRepository>;

  const fakeFindByResponse = {
    total: 10,
    answers: [
      {
        id: '1',
        challengeId: 'fake_challenge_id',
        status: 'Done' as AnswerStatus,
        grade: 10,
        repositoryUrl: 'fake_repository_url',
        createdAt: new Date('2024-12-29T14:58:20.750Z'),
      },
      {
        id: '2',
        challengeId: 'fake_challenge_id',
        status: 'Pending' as AnswerStatus,
        grade: null,
        repositoryUrl: 'fake_repository_url',
        createdAt: new Date('2024-12-29T14:58:20.750Z'),
      },
    ],
  };

  beforeAll(() => {
    answersRepository = mock();
    answersRepository.findBy.mockResolvedValue(fakeFindByResponse);
  });

  beforeEach(() => {
    sut = new ListAnswersService(answersRepository);
  });

  describe('execute', () => {
    // Arrange
    const mockData: IListAnswersServiceDTO = {
      page: 1,
      limit: 10,
      orderBy: 'asc',
      filter: {
        challengeId: 'fake_challenge_id',
        startDate: new Date('2024-12-29T14:58:20.750Z'),
        endDate: new Date('2024-12-30T14:58:20.750Z'),
        status: 'Done',
      },
    };

    it('should be able to find answers by filter', async () => {
      // Act
      const result = await sut.execute(mockData);

      // Assert
      expect(result).toEqual({
        page: mockData.page,
        limit: mockData.limit,
        orderBy: mockData.orderBy,
        total: fakeFindByResponse.total,
        data: fakeFindByResponse.answers,
      });
    });

    it('should be able call answersRepository.findBy with right parameters', async () => {
      // Act
      await sut.execute(mockData);

      // Assert
      expect(answersRepository.findBy).toHaveBeenCalledWith(mockData.filter, {
        page: mockData.page,
        limit: mockData.limit,
        orderBy: mockData.orderBy,
      });
    });

    it('should throw ListAnswersError if repository throws', async () => {
      jest
        .spyOn(answersRepository, 'findBy')
        .mockRejectedValueOnce(new Error());

      // Act
      const promise = sut.execute(mockData);

      // Assert
      expect(promise).rejects.toThrow(new ListAnswersError());
    });
  });
});
