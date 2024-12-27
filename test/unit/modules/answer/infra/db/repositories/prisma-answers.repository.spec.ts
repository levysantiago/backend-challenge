import { MockProxy } from 'jest-mock-extended';
import { PrismaDatabaseProvider } from '@shared/providers/database-provider/implementations/prisma-database.provider';
import { FakePrismaDatabaseProvider } from '@test/mock/fake-prisma-database-provider.mock';
import { PrismaAnswersRepository } from '@modules/answer/infra/db/repositories/prisma-answers.repository';
import { Answer } from '@modules/answer/infra/db/entities/answer';
import { AnswerStatus } from '@modules/answer/infra/types/answer-status';
import { PrismaAnswersMapper } from '@modules/answer/infra/db/mappers/prisma-answers.mapper';

describe('PrismaAnswersRepository', () => {
  let sut: PrismaAnswersRepository;
  let prismaService: MockProxy<PrismaDatabaseProvider>;

  const fakePrismaAnswer: Answer = {
    id: '123',
    challengeId: 'fake_challenge_id',
    grade: 10,
    repositoryUrl: 'fake_repository_url',
    status: 'PENDING',
    createdAt: new Date(),
  };

  const fakeCount = 10;

  const fakePrismaAnswers = [
    {
      id: '1',
      challengeId: 'fake_challenge_id',
      grade: 10,
      repositoryUrl: 'fake_repository_url',
      status: 'PENDING' as AnswerStatus,
      createdAt: new Date(),
    },
    {
      id: '2',
      challengeId: 'fake_challenge_id',
      grade: 6,
      repositoryUrl: 'fake_repository_url',
      status: 'PENDING' as AnswerStatus,
      createdAt: new Date(),
    },
  ];
  const fakeAnswers = fakePrismaAnswers.map(
    (data) => new Answer(data, data.id),
  );

  beforeAll(() => {
    prismaService =
      new FakePrismaDatabaseProvider() as unknown as MockProxy<PrismaDatabaseProvider>;

    // Mock PrismaDatabaseProvider
    jest
      .spyOn(prismaService.answer, 'findUnique')
      .mockResolvedValue(fakePrismaAnswer);

    jest.spyOn(prismaService.answer, 'findMany').mockResolvedValue(fakeAnswers);

    jest.spyOn(prismaService.answer, 'count').mockResolvedValue(fakeCount);

    jest
      .spyOn(prismaService, '$transaction')
      .mockResolvedValue([10, fakeAnswers]);

    // Mock PrismaAnswersMapper
    jest
      .spyOn(PrismaAnswersMapper, 'toPrisma')
      .mockReturnValue(fakePrismaAnswer);

    jest
      .spyOn(PrismaAnswersMapper, 'fromPrisma')
      .mockReturnValue(fakePrismaAnswer);
  });

  beforeEach(async () => {
    sut = new PrismaAnswersRepository(prismaService);
  });

  describe('create', () => {
    const mockAnswer = new Answer({
      challengeId: 'fake_challenge_id',
      repositoryUrl: 'fake_repository_url',
    });

    it('should be able to create a answer in the database', async () => {
      // Act
      const promise = sut.create(mockAnswer);
      // Assert
      expect(promise).resolves.toBeUndefined();
    });

    it('should be able to call prismaService.answer.create with right parameters', async () => {
      // Act
      await sut.create(mockAnswer);
      // Assert
      expect(prismaService.answer.create).toHaveBeenCalledWith({
        data: fakePrismaAnswer,
      });
    });

    it('should be able to call PrismaAnswersMapper.toPrisma with right parameters', async () => {
      // Act
      await sut.create(mockAnswer);
      // Assert
      expect(PrismaAnswersMapper.toPrisma).toHaveBeenCalledWith(mockAnswer);
    });
  });

  describe('save', () => {
    const mockAnswer = new Answer(
      {
        challengeId: 'fake_challenge_id',
        repositoryUrl: 'fake_repository_url',
      },
      'fake_id',
    );

    it('should be able to update an existing answer in the database', async () => {
      // Act
      const promise = sut.save(mockAnswer);
      // Assert
      expect(promise).resolves.toBeUndefined();
    });

    it('should be able to call prismaService.answer.update with right parameters', async () => {
      // Act
      await sut.save(mockAnswer);
      // Assert
      expect(prismaService.answer.update).toHaveBeenCalledWith({
        where: { id: 'fake_id' },
        data: fakePrismaAnswer,
      });
    });

    it('should be able to call PrismaAnswersMapper.toPrisma with right parameters', async () => {
      // Act
      await sut.save(mockAnswer);
      // Assert
      expect(PrismaAnswersMapper.toPrisma).toHaveBeenCalledWith(mockAnswer);
    });
  });

  describe('findBy', () => {
    const filter = {
      challengeId: 'fake_challenge_id',
      startDate: new Date(),
      endDate: new Date(),
      status: 'PENDING' as AnswerStatus,
    };

    const options = { page: 1, limit: 10, orderBy: 'desc' as any };

    it('should find answers by filter', async () => {
      jest
        .spyOn(PrismaAnswersMapper, 'fromPrisma')
        .mockImplementationOnce((data) =>
          fakeAnswers.find((answer) => answer.id === data.id),
        )
        .mockImplementationOnce((data) =>
          fakeAnswers.find((answer) => answer.id === data.id),
        );

      const result = await sut.findBy(filter, options);

      expect(result).toEqual({ answers: fakeAnswers, total: fakeCount });
    });

    it('should call _buildQueryByFilter function with right parameters', async () => {
      const spy = jest.spyOn(sut as any, '_buildQueryByFilter');

      await sut.findBy(filter, options);

      expect(spy).toHaveBeenCalledWith(filter);
    });

    it('should call prismaService.answer.findMany function with right parameters', async () => {
      await sut.findBy(filter, options);

      expect(prismaService.answer.findMany).toHaveBeenCalledWith({
        where: {
          challengeId: filter.challengeId,
          status: filter.status,
          createdAt: { lte: filter.endDate, gte: filter.startDate },
        },
        orderBy: { createdAt: options.orderBy },
        take: options.limit,
        skip: (options.page - 1) * options.limit,
      });
    });

    it('should call prismaService.answer.count function with right parameters', async () => {
      await sut.findBy(filter, options);

      expect(prismaService.answer.count).toHaveBeenCalledWith({
        where: {
          challengeId: filter.challengeId,
          status: filter.status,
          createdAt: { lte: filter.endDate, gte: filter.startDate },
        },
      });
    });

    it('should call prismaService.$transaction function with right parameters', async () => {
      await sut.findBy(filter, options);

      expect(prismaService.$transaction).toHaveBeenCalledWith([
        expect.any(Promise),
        expect.any(Promise),
      ]);
    });
  });

  describe('_buildQueryByFilter', () => {
    const filter = {
      challengeId: 'fake_challenge_id',
      startDate: new Date(),
      endDate: new Date(),
      status: 'PENDING' as AnswerStatus,
    };

    it('should build the query through the filter', () => {
      // eslint-disable-next-line prettier/prettier
      const result = sut["_buildQueryByFilter"](filter);

      expect(result).toEqual({
        challengeId: filter.challengeId,
        status: filter.status,
        createdAt: { lte: filter.endDate, gte: filter.startDate },
      });
    });
  });
});
