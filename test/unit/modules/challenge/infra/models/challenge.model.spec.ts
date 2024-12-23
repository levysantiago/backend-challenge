import { ChallengeModel } from '@modules/challenge/infra/models/challenge.model';

describe('ChallengeModel', () => {
  it('should create an instance with the correct properties', () => {
    const challenge = new ChallengeModel();
    challenge.id = '1';
    challenge.title = 'Sample Challenge';
    challenge.description = 'This is a sample challenge.';
    challenge.createdAt = new Date('2024-01-01T00:00:00Z');

    expect(challenge).toBeDefined();
    expect(challenge.id).toBe('1');
    expect(challenge.title).toBe('Sample Challenge');
    expect(challenge.description).toBe('This is a sample challenge.');
    expect(challenge.createdAt.toISOString()).toBe('2024-01-01T00:00:00.000Z');
  });

  it('should allow updating properties', () => {
    const challenge = new ChallengeModel();
    challenge.id = '2';
    challenge.title = 'Updated Challenge';
    challenge.description = 'This is an updated challenge.';
    challenge.createdAt = new Date('2024-12-31T23:59:59Z');

    expect(challenge.id).toBe('2');
    expect(challenge.title).toBe('Updated Challenge');
    expect(challenge.description).toBe('This is an updated challenge.');
    expect(challenge.createdAt.toISOString()).toBe('2024-12-31T23:59:59.000Z');
  });
});
