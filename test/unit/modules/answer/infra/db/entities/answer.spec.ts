import { ICreateAnswerEntityDTO } from '@modules/answer/infra/db/dtos/icreate-answer-entity.dto';
import { Answer } from '@modules/answer/infra/db/entities/answer';
import { AnswerStatus } from '@modules/answer/infra/types/answer-status';

describe('Answer Entity', () => {
  it('should create a Answer instance with provided properties and generate defaults if not provided', () => {
    // Arrange
    const props: ICreateAnswerEntityDTO = {
      challengeId: 'fake_challenge_id',
      repositoryUrl: 'fake_repository_url',
    };

    // Act
    const challenge = new Answer(props, null);

    // Assert
    expect(challenge).toBeDefined();
    expect(challenge.challengeId).toBe(props.challengeId);
    expect(challenge.repositoryUrl).toBe(props.repositoryUrl);
    expect(challenge.status).toBe('Pending' as AnswerStatus);
    expect(challenge.grade).toBeNull();
    expect(challenge.id).toBeDefined();
    expect(challenge.id).toHaveLength(36); // UUID length
    expect(challenge.createdAt).toBeInstanceOf(Date);
  });

  it('should use the provided id, status, grade and createdAt if given', () => {
    // Arrange
    const id = 'specific-id';
    const createdAt = new Date('2024-01-01T00:00:00Z');
    const props: ICreateAnswerEntityDTO = {
      challengeId: 'fake_challenge_id',
      repositoryUrl: 'fake_repository_url',
      status: 'Error',
      grade: 10,
      createdAt,
    };

    // Act
    const challenge = new Answer(props, id);

    // Assert
    expect(challenge.id).toBe(id);
    expect(challenge.status).toBe('Error');
    expect(challenge.grade).toBe(10);
    expect(challenge.createdAt).toBe(createdAt);
  });

  it('should generate a new id if none is provided', () => {
    // Arrange
    const props: ICreateAnswerEntityDTO = {
      challengeId: 'fake_challenge_id',
      repositoryUrl: 'fake_repository_url',
    };

    // Act
    const challenge = new Answer(props, null);

    // Assert
    expect(challenge.id).toBeDefined();
    expect(challenge.id).toHaveLength(36); // UUID length
  });

  it('should set createdAt to the current date if not provided', () => {
    // Arrange
    const props: ICreateAnswerEntityDTO = {
      challengeId: 'fake_challenge_id',
      repositoryUrl: 'fake_repository_url',
    };

    // Act
    const challenge = new Answer(props, null);

    // Assert
    const now = new Date();
    expect(challenge.createdAt).toBeDefined();
    expect(challenge.createdAt).toBeInstanceOf(Date);
    expect(challenge.createdAt.getTime()).toBeCloseTo(now.getTime(), -100); // Allow small time diff
  });
});
