import { Challenge } from '@modules/challenge/infra/db/entities/challenge';
import { PrismaChallengesMapper } from '@modules/challenge/infra/db/mappers/prisma-challenges.mapper';
import { PrismaChallengesRepository } from '@modules/challenge/infra/db/repositories/prisma-challenges.repository';
import { MockProxy } from 'jest-mock-extended';
import { PrismaDatabaseProvider } from '@shared/providers/database-provider/implementations/prisma-database.provider';
import { FakePrismaDatabaseProvider } from '@test/mock/fake-prisma-database-provider.mock';

describe('PrismaChallengesRepository', () => {
  let sut: PrismaChallengesRepository;
  let prismaService: MockProxy<PrismaDatabaseProvider>;

  const fakePrismaChallenge = {
    id: '123',
    title: 'Test Title',
    description: 'Test Description',
    createdAt: new Date(),
  };

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
      .spyOn(prismaService.challenge, 'findMany')
      .mockResolvedValue(fakeChallenges);

    // Mock PrismaChallengesMapper
    jest
      .spyOn(PrismaChallengesMapper, 'toPrisma')
      .mockReturnValue(fakePrismaChallenge);

    jest
      .spyOn(PrismaChallengesMapper, 'fromPrisma')
      .mockImplementation((data) =>
        fakeChallenges.find((challenge) => challenge.id === data.id),
      );
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

  describe('findByTitle', () => {
    it('should find challenges by title', async () => {
      const result = await sut.findByTitle('Title', { order: 'desc' });

      expect(prismaService.challenge.findMany).toHaveBeenCalledWith({
        where: { title: { contains: 'Title' } },
        orderBy: { createdAt: 'desc' },
      });
      expect(PrismaChallengesMapper.fromPrisma).toHaveBeenCalledTimes(
        fakePrismaChallenges.length,
      );
      expect(result).toEqual(fakeChallenges);
    });
  });

  describe('findByDescription', () => {
    it('should find challenges by description', async () => {
      const result = await sut.findByDescription('Description', {
        order: 'asc',
      });

      expect(prismaService.challenge.findMany).toHaveBeenCalledWith({
        where: { description: { contains: 'Description' } },
        orderBy: { createdAt: 'asc' },
      });
      expect(result).toEqual(fakeChallenges);
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
