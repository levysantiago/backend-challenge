import { ICreateChallengeEntityDTO } from '@modules/challenge/infra/db/dtos/icreate-challenge-entity.dto';
import { Challenge } from '@modules/challenge/infra/db/entities/challenge';

describe('Challenge Entity', () => {
  it('should create a Challenge instance with provided properties and generate defaults if not provided', () => {
    // Arrange
    const props: ICreateChallengeEntityDTO = {
      title: 'Test Challenge',
      description: 'This is a test challenge',
    };

    // Act
    const challenge = new Challenge(props, null);

    // Assert
    expect(challenge).toBeDefined();
    expect(challenge.title).toBe('Test Challenge');
    expect(challenge.description).toBe('This is a test challenge');
    expect(challenge.id).toBeDefined();
    expect(challenge.id).toHaveLength(36); // UUID length
    expect(challenge.createdAt).toBeInstanceOf(Date);
  });

  it('should use the provided id and createdAt if given', () => {
    // Arrange
    const id = 'specific-id';
    const createdAt = new Date('2024-01-01T00:00:00Z');
    const props: ICreateChallengeEntityDTO = {
      title: 'Specific Challenge',
      description: 'This challenge has specific id and createdAt',
      createdAt,
    };

    // Act
    const challenge = new Challenge(props, id);

    // Assert
    expect(challenge.id).toBe(id);
    expect(challenge.createdAt).toBe(createdAt);
  });

  it('should generate a new id if none is provided', () => {
    // Arrange
    const props: ICreateChallengeEntityDTO = {
      title: 'Challenge Without ID',
      description: 'This challenge should generate an ID',
    };

    // Act
    const challenge = new Challenge(props, null);

    // Assert
    expect(challenge.id).toBeDefined();
    expect(challenge.id).toHaveLength(36); // UUID length
  });

  it('should set createdAt to the current date if not provided', () => {
    // Arrange
    const props: ICreateChallengeEntityDTO = {
      title: 'Challenge Without CreatedAt',
      description: 'This challenge should use the current date',
    };

    // Act
    const challenge = new Challenge(props, null);

    // Assert
    const now = new Date();
    expect(challenge.createdAt).toBeDefined();
    expect(challenge.createdAt).toBeInstanceOf(Date);
    expect(challenge.createdAt.getTime()).toBeCloseTo(now.getTime(), -100); // Allow small time diff
  });
});
