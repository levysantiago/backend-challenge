import { DateScalar } from '@shared/infra/scalar-types/date.scalar';
import { Kind } from 'graphql';

describe('DateScalar', () => {
  let dateScalar: DateScalar;

  beforeEach(() => {
    dateScalar = new DateScalar();
  });

  it('should have the correct description', () => {
    expect(dateScalar.description).toBe('Date custom scalar type');
  });

  describe('parseValue', () => {
    it('should parse a valid date string into a Date object', () => {
      const dateString = '2024-01-01T00:00:00.000Z';
      const result = dateScalar.parseValue(dateString);
      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toBe(dateString);
    });

    it('should return an invalid Date object for an invalid date string', () => {
      const invalidDate = 'invalid-date';
      const result = dateScalar.parseValue(invalidDate);
      expect(result).toBeInstanceOf(Date);
      expect(result.toString()).toBe('Invalid Date');
    });
  });

  describe('serialize', () => {
    it('should serialize a Date object into an ISO string', () => {
      const date = new Date('2024-01-01T00:00:00.000Z');
      const result = dateScalar.serialize(date);
      expect(result).toBe('2024-01-01T00:00:00.000Z');
    });

    it('should throw an error if the value is not a Date object', () => {
      expect(() => dateScalar.serialize('not-a-date' as any)).toThrow();
    });
  });

  describe('parseLiteral', () => {
    it('should parse a valid string literal into a Date object', () => {
      const ast = { kind: Kind.STRING, value: '2024-01-01T00:00:00.000Z' };
      const result = dateScalar.parseLiteral(ast as any);
      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toBe('2024-01-01T00:00:00.000Z');
    });

    it('should return null for non-string literals', () => {
      const ast = { kind: Kind.INT, value: '1234567890' };
      const result = dateScalar.parseLiteral(ast as any);
      expect(result).toBeNull();
    });

    it('should return an invalid Date object for an invalid date string literal', () => {
      const ast = { kind: Kind.STRING, value: 'invalid-date' };
      const result = dateScalar.parseLiteral(ast as any);
      expect(result).toBeInstanceOf(Date);
      expect(result.toString()).toBe('Invalid Date');
    });
  });
});
