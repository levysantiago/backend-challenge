import { InternalServerError } from '@shared/infra/errors/internal-server.error';
import { GraphQLHttpExceptionFilter } from '@shared/infra/filters/exception.filter';
import { LoggerProvider } from '@shared/providers/logger-provider/types/logger.provider';
import { GraphQLError } from 'graphql';
import { mock, MockProxy } from 'jest-mock-extended';

describe('GraphQLHttpExceptionFilter', () => {
  let filter: GraphQLHttpExceptionFilter;
  let logger: MockProxy<LoggerProvider>;

  beforeAll(() => {
    logger = mock();
  });

  beforeEach(() => {
    filter = new GraphQLHttpExceptionFilter(logger);
  });

  it('should return the GraphQLError as-is when not an InternalServerError', () => {
    // Arrange
    const graphQLError = new GraphQLError('Some GraphQL error');

    // Act
    const result = filter.catch(graphQLError);

    // Assert
    expect(result).toBe(graphQLError);
  });

  it('should log the error and return the same error if it is an InternalServerError', () => {
    // Arrange
    const internalError = new InternalServerError();
    const loggerSpy = jest.spyOn(logger, 'error');

    // Act
    const result = filter.catch(internalError);

    // Assert
    expect(loggerSpy).toHaveBeenCalledWith(internalError);
    expect(result).toBe(internalError);
  });
});
