import { PrismaDatabaseProvider } from '@shared/providers/database-provider/implementations/prisma-database.provider';
import { PrismaChallengesMapper } from '../mappers/prisma-challenges.mapper';
import { Challenge } from '../entities/challenge';
import { ChallengesRepository } from '@modules/challenge/repositories/challenges.repository';
import { Injectable } from '@nestjs/common';
import { ISearchOptions } from '@shared/infra/db-types/isearch-options';
import { IFindChallengesFilter } from '../types/ifind-challenges-filter';
import { IFindChallengesResponse } from '../types/ifind-challenges-response';

interface IFindChallengesQuery {
  title?: { contains: string };
  description?: { contains: string };
}

@Injectable()
export class PrismaChallengesRepository implements ChallengesRepository {
  constructor(private prismaService: PrismaDatabaseProvider) {}

  async create(challenge: Challenge): Promise<void> {
    await this.prismaService.challenge.create({
      data: PrismaChallengesMapper.toPrisma(challenge),
    });
  }

  async save(challenge: Challenge): Promise<void> {
    await this.prismaService.challenge.update({
      where: { id: challenge.id },
      data: PrismaChallengesMapper.toPrisma(challenge),
    });
  }

  async find(id: string): Promise<Challenge | null> {
    const rawChallenge = await this.prismaService.challenge.findUnique({
      where: {
        id,
      },
    });

    if (!rawChallenge) {
      return null;
    }

    return PrismaChallengesMapper.fromPrisma(rawChallenge);
  }

  async findBy(
    filter: IFindChallengesFilter = {},
    options: ISearchOptions = {},
  ): Promise<IFindChallengesResponse> {
    // Handling pagination variables
    const _page = options.page ?? 1;
    const _take = options.limit ?? 20;

    // Building query
    const query = this._buildQueryByFilter(filter);

    // Finding challenges based on query and pagination data
    const [count, rawChallenges] = await this.prismaService.$transaction([
      this.prismaService.challenge.count({ where: query }),
      this.prismaService.challenge.findMany({
        where: query,
        orderBy: { createdAt: options.orderBy ?? 'asc' },
        take: _take,
        skip: (_page - 1) * _take,
      }),
    ]);

    // Parsing
    return {
      total: count,
      challenges: rawChallenges.map(PrismaChallengesMapper.fromPrisma),
    };
  }

  async delete(challengeId: string): Promise<Challenge | null> {
    try {
      const rawChallenge = await this.prismaService.challenge.delete({
        where: { id: challengeId },
      });

      return PrismaChallengesMapper.fromPrisma(rawChallenge);
    } catch (err) {
      return null;
    }
  }

  private _buildQueryByFilter(
    filter: IFindChallengesFilter = {},
  ): IFindChallengesQuery {
    // Building query
    const query = {};
    if (filter.title) {
      query['title'] = {
        contains: filter.title,
      };
    }

    if (filter.description) {
      query['description'] = {
        contains: filter.description,
      };
    }

    return query;
  }
}
