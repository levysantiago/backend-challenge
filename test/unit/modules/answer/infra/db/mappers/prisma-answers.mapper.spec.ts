import { Answer } from '@modules/answer/infra/db/entities/answer';
import { PrismaAnswersMapper } from '@modules/answer/infra/db/mappers/prisma-answers.mapper';
import { Answer as RawAnswer } from '@prisma/client';

describe('PrismaAnswersMapper', () => {
  describe('toPrisma', () => {
    it('should map a Answer entity to a RawAnswer object', () => {
      const challengeEntity = new Answer(
        {
          challengeId: 'fake_challenge_id',
          grade: 10,
          repositoryUrl: 'fake_repository_url',
          status: 'Pending',
          createdAt: new Date('2024-01-01T00:00:00Z'),
        },
        '123',
      );

      const prismaAnswer = PrismaAnswersMapper.toPrisma(challengeEntity);

      expect(prismaAnswer).toEqual({
        id: '123',
        challengeId: 'fake_challenge_id',
        grade: 10,
        repositoryUrl: 'fake_repository_url',
        status: 'Pending',
        createdAt: new Date('2024-01-01T00:00:00Z'),
      });
    });
  });

  describe('fromPrisma', () => {
    it('should map a RawChallenge object to a Challenge entity', () => {
      const rawChallenge: RawAnswer = {
        id: '123',
        challengeId: 'fake_challenge_id',
        grade: 10,
        repositoryUrl: 'fake_repository_url',
        status: 'Pending',
        createdAt: new Date('2024-01-01T00:00:00Z'),
      };

      const answerEntity = PrismaAnswersMapper.fromPrisma(rawChallenge);

      expect(answerEntity).toBeInstanceOf(Answer);
      expect(answerEntity.id).toBe(rawChallenge.id);
      expect(answerEntity.challengeId).toBe(rawChallenge.challengeId);
      expect(answerEntity.grade).toBe(rawChallenge.grade);
      expect(answerEntity.status).toBe(rawChallenge.status);
      expect(answerEntity.createdAt).toBe(rawChallenge.createdAt);
    });
  });
});
