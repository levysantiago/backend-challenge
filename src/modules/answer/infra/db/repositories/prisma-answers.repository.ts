import { Injectable } from '@nestjs/common';
import { PrismaDatabaseProvider } from '@shared/providers/database-provider/implementations/prisma-database.provider';
import { Answer } from '../entities/answer';
import { AnswersRepository } from '@modules/answer/repositories/answers.repository';
import { PrismaAnswersMapper } from '../mappers/prisma-answers.mapper';
import { IFindAnswersByFilter } from '../../types/ifind-answers-by-filter';
import { ISearchOptions } from '@shared/infra/db-types/isearch-options';
import { IFindAnswersResponse } from '../../types/ifind-answerts-response';
import { AnswerStatus } from '../../types/answer-status';

interface IFindAnswersQuery {
  challengeId?: string;
  status?: AnswerStatus;
  createdAt?: {
    lte?: Date;
    gte?: Date;
  };
}

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(private prismaService: PrismaDatabaseProvider) {}

  async create(answer: Answer): Promise<void> {
    await this.prismaService.answer.create({
      data: PrismaAnswersMapper.toPrisma(answer),
    });
  }

  async save(answer: Answer): Promise<void> {
    await this.prismaService.answer.update({
      where: { id: answer.id },
      data: PrismaAnswersMapper.toPrisma(answer),
    });
  }

  async findBy(
    filter: IFindAnswersByFilter = {},
    options: ISearchOptions = {},
  ): Promise<IFindAnswersResponse> {
    // Handling pagination variables
    const _page = options.page ?? 1;
    const _take = options.limit ?? 20;

    // Building query
    const query = this._buildQueryByFilter(filter);

    // Finding answers based on query and pagination data
    const [count, rawAnswers] = await this.prismaService.$transaction([
      this.prismaService.answer.count({
        where: query,
      }),
      this.prismaService.answer.findMany({
        where: query,
        orderBy: { createdAt: options.orderBy ?? 'asc' },
        take: _take,
        skip: (_page - 1) * _take,
      }),
    ]);

    // Parsing
    return {
      total: count,
      answers: rawAnswers.map(PrismaAnswersMapper.fromPrisma),
    };
  }

  private _buildQueryByFilter(
    filter: IFindAnswersByFilter = {},
  ): IFindAnswersQuery {
    // Building query
    const query = {};

    // Handle challengeId
    if (filter.challengeId) {
      query['challengeId'] = {
        challengeId: filter.challengeId,
      };
    }

    // Handle status
    if (filter.status) {
      query['status'] = {
        status: filter.status,
      };
    }

    // Handle dates
    const queryDates = {};
    if (filter.startDate) queryDates['gte'] = filter.startDate;
    if (filter.endDate) queryDates['lte'] = filter.endDate;

    query['createdAt'] = queryDates;

    return query;
  }
}
