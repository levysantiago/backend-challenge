import { Challenge } from '@modules/challenge/infra/db/entities/challenge';
import { PrismaChallengesMapper } from '@modules/challenge/infra/db/mappers/prisma-challenges.mapper';
import { Challenge as RawChallenge } from '@prisma/client';

describe('PrismaChallengesMapper', () => {
  describe('toPrisma', () => {
    it('should map a Challenge entity to a RawChallenge object', () => {
      const challengeEntity = new Challenge(
        {
          title: 'Test Challenge',
          description: 'A challenge for testing purposes',
          createdAt: new Date('2024-01-01T00:00:00Z'),
        },
        '123',
      );

      const prismaChallenge = PrismaChallengesMapper.toPrisma(challengeEntity);

      expect(prismaChallenge).toEqual({
        id: '123',
        title: 'Test Challenge',
        description: 'A challenge for testing purposes',
        createdAt: new Date('2024-01-01T00:00:00Z'),
      });
    });
  });

  describe('fromPrisma', () => {
    it('should map a RawChallenge object to a Challenge entity', () => {
      const rawChallenge: RawChallenge = {
        id: '123',
        title: 'Test Challenge',
        description: 'A challenge from Prisma',
        createdAt: new Date('2024-01-01T00:00:00Z'),
      };

      const challengeEntity = PrismaChallengesMapper.fromPrisma(rawChallenge);

      expect(challengeEntity).toBeInstanceOf(Challenge);
      expect(challengeEntity.id).toBe('123');
      expect(challengeEntity.title).toBe('Test Challenge');
      expect(challengeEntity.description).toBe('A challenge from Prisma');
      expect(challengeEntity.createdAt.toISOString()).toBe(
        '2024-01-01T00:00:00.000Z',
      );
    });
  });
});
