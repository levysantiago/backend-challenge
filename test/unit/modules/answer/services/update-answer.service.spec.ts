import { Answer } from '@modules/answer/infra/db/entities/answer';
import { AnswerNotFoundError } from '@modules/answer/infra/errors/answer-not-found.error';
import { UpdateAnswerError } from '@modules/answer/infra/errors/update-answer.error';
import { AnswersRepository } from '@modules/answer/repositories/answers.repository';
import { IUpdateAnswerServiceDTO } from '@modules/answer/services/dtos/iupdate-answer-service.dto';
import { UpdateAnswerService } from '@modules/answer/services/update-answer.service';
import { LoggerProvider } from '@shared/providers/logger-provider/types/logger.provider';
import { mock, MockProxy } from 'jest-mock-extended';

describe('UpdateAnswerService', () => {
  let sut: UpdateAnswerService;
  let logger: MockProxy<LoggerProvider>;
  let answersRepository: MockProxy<AnswersRepository>;

  const fakeAnswer: Answer = {
    id: 'fake_id',
    challengeId: 'fake_challenge_id',
    status: 'Pending',
    grade: null,
    repositoryUrl: 'fake_repository_url',
    createdAt: new Date('2024-12-29T14:58:20.750Z'),
  };

  beforeAll(() => {
    logger = mock();
    answersRepository = mock();

    // Mock ChallengesRepository
    answersRepository.find.mockResolvedValue(fakeAnswer);
  });

  beforeEach(() => {
    sut = new UpdateAnswerService(logger, answersRepository);
  });

  describe('execute', () => {
    // Arrange
    const mockData: IUpdateAnswerServiceDTO = {
      id: 'fake_id',
      data: {
        status: 'Done',
        grade: 10,
      },
    };

    it('should be able to update a registered answer', async () => {
      // Act
      const result = await sut.execute(mockData);
      // Assert
      expect(result).toEqual({
        data: {
          ...fakeAnswer,
          status: mockData.data.status,
          grade: mockData.data.grade,
        },
      });
    });

    it('should be able call answersRepository.find with right parameters', async () => {
      // Act
      await sut.execute(mockData);
      // Assert
      expect(answersRepository.find).toHaveBeenCalledWith(mockData.id);
    });

    it('should be able call answersRepository.save with right parameters', async () => {
      // Act
      await sut.execute(mockData);
      // Assert
      expect(answersRepository.save).toHaveBeenCalledWith({
        ...fakeAnswer,
        status: mockData.data.status,
        grade: mockData.data.grade,
      });
    });

    it('should rethrow AnswerNotFoundError if answer does not exists', async () => {
      jest.spyOn(answersRepository, 'find').mockResolvedValueOnce(null);
      // Act
      const promise = sut.execute(mockData);
      // Assert
      expect(promise).rejects.toThrow(new AnswerNotFoundError());
    });

    it('should throw UpdateAnswerError if challenge does not exists', async () => {
      jest
        .spyOn(answersRepository, 'save')
        .mockRejectedValueOnce(new Error('unknown'));
      // Act
      const promise = sut.execute(mockData);
      // Assert
      expect(promise).rejects.toThrow(new UpdateAnswerError());
    });
  });
});
