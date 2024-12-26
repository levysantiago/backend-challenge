import { Challenge } from '@modules/challenge/infra/db/entities/challenge';
import { PrismaChallengesMapper } from '@modules/challenge/infra/db/mappers/prisma-challenges.mapper';
import { PrismaChallengesRepository } from '@modules/challenge/infra/db/repositories/prisma-challenges.repository';
import { MockProxy } from 'jest-mock-extended';
import { PrismaDatabaseProvider } from '@shared/providers/database-provider/implementations/prisma-database.provider';
import { FakePrismaDatabaseProvider } from '@test/mock/fake-prisma-database-provider.mock';

describe('PrismaChallengesRepository', () => {
  let sut: PrismaChallengesRepository;
  let prismaService: MockProxy<PrismaDatabaseProvider>;

  const fakePrismaChallenge: Challenge = {
    id: '123',
    title: 'Test Title',
    description: 'Test Description',
    createdAt: new Date(),
  };

  const fakeCount = 10;

  const fakePrismaChallenges = [
    { id: '1', title: 'Title 1', description: 'Description 1' },
    { id: '2', title: 'Title 2', description: 'Description 2' },
  ];
  const fakeChallenges = fakePrismaChallenges.map(
    (data) => new Challenge(data, data.id),
  );

  beforeAll(() => {
    prismaService =
      new FakePrismaDatabaseProvider() as unknown as MockProxy<PrismaDatabaseProvider>;

    // Mock PrismaDatabaseProvider
    jest
      .spyOn(prismaService.challenge, 'findUnique')
      .mockResolvedValue(fakePrismaChallenge);

    jest
      .spyOn(prismaService.challenge, 'findMany')
      .mockResolvedValue(fakeChallenges);

    jest.spyOn(prismaService.challenge, 'count').mockResolvedValue(fakeCount);

    jest
      .spyOn(prismaService, '$transaction')
      .mockResolvedValue([10, fakeChallenges]);

    // Mock PrismaChallengesMapper
    jest
      .spyOn(PrismaChallengesMapper, 'toPrisma')
      .mockReturnValue(fakePrismaChallenge);

    jest
      .spyOn(PrismaChallengesMapper, 'fromPrisma')
      .mockReturnValue(fakePrismaChallenge);
  });

  beforeEach(async () => {
    sut = new PrismaChallengesRepository(prismaService);
  });

  describe('create', () => {
    it('should create a challenge in the database', async () => {
      const mockChallenge = new Challenge(
        { title: 'Test Title', description: 'Test Description' },
        '123',
      );

      await sut.create(mockChallenge);

      expect(PrismaChallengesMapper.toPrisma).toHaveBeenCalledWith(
        mockChallenge,
      );
      expect(prismaService.challenge.create).toHaveBeenCalledWith({
        data: fakePrismaChallenge,
      });
    });
  });

  describe('save', () => {
    it('should update an existing challenge in the database', async () => {
      const mockChallenge = new Challenge(
        { title: 'Updated Title', description: 'Updated Description' },
        '123',
      );

      await sut.save(mockChallenge);

      expect(PrismaChallengesMapper.toPrisma).toHaveBeenCalledWith(
        mockChallenge,
      );
      expect(prismaService.challenge.update).toHaveBeenCalledWith({
        where: { id: '123' },
        data: fakePrismaChallenge,
      });
    });
  });

  describe('find', () => {
    it('should find challenges by title', async () => {
      const result = await sut.find('fake-id');

      expect(prismaService.challenge.findUnique).toHaveBeenCalledWith({
        where: { id: 'fake-id' },
      });
      expect(PrismaChallengesMapper.fromPrisma).toHaveBeenCalledWith(
        fakePrismaChallenge,
      );
      expect(result).toEqual(fakePrismaChallenge);
    });
  });

  describe('findBy', () => {
    function _beforeEach() {
      jest
        .spyOn(PrismaChallengesMapper, 'fromPrisma')
        .mockImplementation((data) =>
          fakeChallenges.find((challenge) => challenge.id === data.id),
        );
    }

    it('should find challenges by filter', async () => {
      _beforeEach();

      const result = await sut.findBy(
        { title: 'fake-title' },
        { page: 1, limit: 10, orderBy: 'desc' },
      );

      expect(result).toEqual({ challenges: fakeChallenges, total: fakeCount });
    });

    it('should call _buildQueryByFilter function with right parameters', async () => {
      _beforeEach();

      const spy = jest.spyOn(sut as any, '_buildQueryByFilter');

      await sut.findBy(
        { title: 'fake_title' },
        { page: 1, limit: 10, orderBy: 'desc' },
      );

      expect(spy).toHaveBeenCalledWith({
        title: 'fake_title',
      });
    });

    it('should call prismaService.challenge.findMany function with right parameters', async () => {
      _beforeEach();

      await sut.findBy(
        { title: 'fake_title' },
        { page: 1, limit: 10, orderBy: 'desc' },
      );

      expect(prismaService.challenge.findMany).toHaveBeenCalledWith({
        where: { title: { contains: 'fake_title' } },
        orderBy: { createdAt: 'desc' },
        take: 10,
        skip: 0,
      });
    });

    it('should call prismaService.challenge.count function with right parameters', async () => {
      _beforeEach();

      await sut.findBy(
        { title: 'fake_title' },
        { page: 1, limit: 10, orderBy: 'desc' },
      );

      expect(prismaService.challenge.count).toHaveBeenCalledWith({
        where: { title: { contains: 'fake_title' } },
      });
    });

    it('should call prismaService.$transaction function with right parameters', async () => {
      _beforeEach();

      await sut.findBy(
        { title: 'fake_title' },
        { page: 1, limit: 10, orderBy: 'desc' },
      );

      expect(prismaService.$transaction).toHaveBeenCalledWith([
        expect.any(Promise),
        expect.any(Promise),
      ]);
    });

    it('should call PrismaChallengesMapper.fromPrisma with right parameters', async () => {
      jest
        .spyOn(PrismaChallengesMapper, 'fromPrisma')
        .mockImplementation((data) =>
          fakeChallenges.find((challenge) => challenge.id === data.id),
        );

      await sut.findBy(
        { title: 'fake-title' },
        { page: 1, limit: 10, orderBy: 'desc' },
      );

      expect(PrismaChallengesMapper.fromPrisma).toHaveBeenCalledWith(
        fakePrismaChallenge,
      );
    });
  });

  describe('_buildQueryByFilter', () => {
    it('should build the query through the filter', () => {
      // eslint-disable-next-line prettier/prettier
      const result = sut["_buildQueryByFilter"]({title: "fake_title"});

      expect(result).toEqual({
        title: { contains: 'fake_title' },
      });
    });
  });

  describe('remove', () => {
    it('should delete a challenge from the database', async () => {
      const mockChallenge = new Challenge(
        { title: 'Test Title', description: 'Test Description' },
        '123',
      );

      await sut.remove(mockChallenge);

      expect(prismaService.challenge.delete).toHaveBeenCalledWith({
        where: { id: mockChallenge.id },
      });
    });
  });
});
