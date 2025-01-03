import { Injectable } from '@nestjs/common';
import { SubmitAnswerToCorrectionService } from '../services/submit-answer-to-correction.service';
import { Cron } from '@nestjs/schedule';
import { AnswersRepository } from '../repositories/answers.repository';
import { UpdateAnswerService } from '../services/update-answer.service';
import { ICorrectLessonResponse } from '@shared/providers/messaging-provider/dtos/icorrect-lessons-response';
import * as dayjs from 'dayjs';
import { LoggerProvider } from '@shared/providers/logger-provider/types/logger.provider';

/**
 * This worker service is used to handle any Answer that was not sent to correction or
 * maybe some error occurred and the API couldn't catch the correction messaging response.
 *
 * This worker verify the answers on every hour, if the answer was not corrected after
 * 10 minutes, it means there was some error when trying to correct this Answer on its creation.
 */

@Injectable()
export class WatchPendingAnswersWorker {
  constructor(
    private readonly logger: LoggerProvider,
    private readonly submitAnswerToCorrectionService: SubmitAnswerToCorrectionService,
    private readonly updateAnswerService: UpdateAnswerService,
    private readonly answersRepository: AnswersRepository,
  ) {}

  // Runs every 1 hour
  @Cron('0 0 * * * *') // CRON format: At minute 0 of every hour
  async handleConditionCheck() {
    this.logger.log(
      'Starting worker to check conditions in the database...',
      'WatchPendingAnswersWorker',
    );

    // Query database
    const { answers } = await this.answersRepository.findBy(
      {
        status: 'Pending',
      },
      {},
    );

    // Prepare answer correction handler
    const handleAnswerCorrectionCallback = async (
      result: ICorrectLessonResponse,
    ) => {
      // Update answer after receiving the result as callback
      await this.updateAnswerService.execute({
        id: result.submissionId,
        data: {
          grade: result.grade,
          status: result.status,
        },
      });
    };

    // Defining max minutes for a Answer without correction
    const maxMinutesWithoutCorrection = 10;

    // Current date
    const currentDate = dayjs();

    for (const answer of answers) {
      // Calculate how many minutes the Answer have with no correction
      const minutesOfAnswerNotCorrected = dayjs(currentDate).diff(
        answer.createdAt,
        'minutes',
      );
      // Verify if Answer correction is pending
      const isCorrectionPending =
        minutesOfAnswerNotCorrected > maxMinutesWithoutCorrection;
      if (isCorrectionPending) {
        // Submit answer to correction
        this.submitAnswerToCorrectionService.execute({
          answer,
          handleAnswerCorrectionCallback,
        });
      }
    }

    this.logger.log('Condition check completed.', 'WatchPendingAnswersWorker');
  }
}
