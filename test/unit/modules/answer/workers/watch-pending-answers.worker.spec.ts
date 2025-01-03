import { AnswerStatus } from '@modules/answer/infra/types/answer-status';
import { AnswersRepository } from '@modules/answer/repositories/answers.repository';
import { SubmitAnswerToCorrectionService } from '@modules/answer/services/submit-answer-to-correction.service';
import { UpdateAnswerService } from '@modules/answer/services/update-answer.service';
import { WatchPendingAnswersWorker } from '@modules/answer/workers/watch-pending-answers.worker';
import { LoggerProvider } from '@shared/providers/logger-provider/types/logger.provider';
import * as dayjs from 'dayjs';
import { mock, MockProxy } from 'jest-mock-extended';

describe('WatchPendingAnswersWorker', () => {
  let sut: WatchPendingAnswersWorker;
  let logger: MockProxy<LoggerProvider>;
  let submitAnswerToCorrectionService: MockProxy<SubmitAnswerToCorrectionService>;
  let updateAnswerService: MockProxy<UpdateAnswerService>;
  let answersRepository: MockProxy<AnswersRepository>;

  beforeEach(() => {
    logger = mock();
    submitAnswerToCorrectionService = mock();
    updateAnswerService = mock();
    answersRepository = mock();

    // Mock SubmitAnswerToCorrectionService
    submitAnswerToCorrectionService.execute.mockReturnValue();

    // Mock UpdateAnswerService
    updateAnswerService.execute.mockResolvedValue({
      data: {
        id: '1',
        challengeId: 'fake_challenge_id',
        status: 'Done' as AnswerStatus,
        grade: 10,
        repositoryUrl: 'fake_repository_url',
        createdAt: new Date('2024-12-29T14:58:20.750Z'),
      },
    });

    // Instantiate worker with mocked dependencies
    sut = new WatchPendingAnswersWorker(
      logger,
      submitAnswerToCorrectionService,
      updateAnswerService,
      answersRepository,
    );
  });

  it('should submit answers for correction if pending beyond threshold', async () => {
    const currentDate = new Date();
    const tenMinutesAgo = dayjs(currentDate).subtract(10, 'minutes').toDate();
    const elevenMinutesAgo = dayjs(currentDate)
      .subtract(11, 'minutes')
      .toDate();

    // Mock answers repository to return answers
    answersRepository.findBy.mockResolvedValue({
      answers: [
        { id: '1', createdAt: tenMinutesAgo, status: 'Pending' },
        { id: '2', createdAt: elevenMinutesAgo, status: 'Pending' },
      ] as any,
      total: 2,
    });

    // Execute worker method
    await sut.handleConditionCheck();

    // Expect the service to be called for the overdue answer
    expect(submitAnswerToCorrectionService.execute).toHaveBeenCalledTimes(1);
    expect(submitAnswerToCorrectionService.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        answer: { id: '2', createdAt: elevenMinutesAgo, status: 'Pending' },
      }),
    );
  });

  it('should not submit answers for correction if within threshold', async () => {
    const currentDate = new Date();
    const nineMinutesAgo = dayjs(currentDate).subtract(9, 'minutes').toDate();

    // Mock answers repository to return answers within threshold
    answersRepository.findBy.mockResolvedValue({
      answers: [
        { id: '3', createdAt: nineMinutesAgo, status: 'Pending' },
      ] as any,
      total: 1,
    });

    // Execute worker method
    await sut.handleConditionCheck();

    // Expect no submission
    expect(submitAnswerToCorrectionService.execute).not.toHaveBeenCalled();
  });
});
