import { PrismaDatabaseProvider } from '@shared/providers/database-provider/implementations/prisma-database.provider';
import { PrismaChallengesMapper } from '../mappers/prisma-challenges.mapper';
import { Challenge } from '../entities/challenge';
import { ChallengesRepository } from '@modules/challenge/repositories/challenges.repository';
import { Injectable } from '@nestjs/common';
import { ISearchOptions } from '@shared/infra/db-types/isearch-options';

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

  async findByTitle(
    title: string,
    options: ISearchOptions = {},
  ): Promise<Challenge[]> {
    const rawChallenges = await this.prismaService.challenge.findMany({
      where: {
        title: {
          contains: title,
        },
      },
      orderBy: { createdAt: options.order ?? 'asc' },
    });
    return rawChallenges.map(PrismaChallengesMapper.fromPrisma);
  }

  async findByDescription(
    description: string,
    options: ISearchOptions = {},
  ): Promise<Challenge[]> {
    const rawChallenges = await this.prismaService.challenge.findMany({
      where: {
        description: {
          contains: description,
        },
      },
      orderBy: { createdAt: options.order ?? 'asc' },
    });
    return rawChallenges.map(PrismaChallengesMapper.fromPrisma);
  }

  async remove(challenge: Challenge): Promise<void> {
    await this.prismaService.challenge.delete({
      where: { id: challenge.id },
    });
  }
}
