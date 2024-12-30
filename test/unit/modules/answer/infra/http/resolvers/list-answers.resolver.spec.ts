import { mock, MockProxy } from 'jest-mock-extended';
import { ListAnswersResolver } from '@modules/answer/infra/http/resolvers/list-answers.resolver';
import { ListAnswersService } from '@modules/answer/services/list-answers.service';
import { IListAnswersServiceResponseDTO } from '@modules/answer/services/dtos/ilist-answers-service-response.dto';
import { AnswerStatus } from '@modules/answer/infra/types/answer-status';
import { ListAnswersInput } from '@modules/answer/infra/http/inputs/list-answers.input';

describe('ListAnswersResolver', () => {
  let sut: ListAnswersResolver;
  let listAnswersService: MockProxy<ListAnswersService>;

  const mockResponse: IListAnswersServiceResponseDTO = {
    page: 1,
    limit: 10,
    orderBy: 'asc',
    total: 10,
    data: [
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
    listAnswersService = mock();
    listAnswersService.execute.mockResolvedValueOnce(mockResponse);
  });

  beforeEach(async () => {
    sut = new ListAnswersResolver(listAnswersService);
  });

  describe('listAnswers', () => {
    it('should call listAnswersService.execute and return the response', async () => {
      // Arrange
      const mockInput: ListAnswersInput = {
        filter: {
          challengeId: 'fake_challenge_id',
          startDate: new Date('2024-12-29T14:58:20.750Z'),
          endDate: new Date('2024-12-30T14:58:20.750Z'),
          status: 'Done',
        },
        page: 1,
        limit: 10,
        orderBy: 'asc',
      };

      // Act
      const result = await sut.listAnswers(mockInput);

      // Assert
      expect(listAnswersService.execute).toHaveBeenCalledWith(mockInput);
      expect(result).toEqual(mockResponse);
    });
  });
});
