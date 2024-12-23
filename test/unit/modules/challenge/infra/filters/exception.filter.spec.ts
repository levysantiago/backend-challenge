import { InternalServerError } from '@shared/infra/errors/internal-server.error';
import { GraphQLHttpExceptionFilter } from '@shared/infra/filters/exception.filter';
import { GraphQLError } from 'graphql';

describe('GraphQLHttpExceptionFilter', () => {
  let filter: GraphQLHttpExceptionFilter;

  beforeEach(() => {
    filter = new GraphQLHttpExceptionFilter();
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
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    // Act
    const result = filter.catch(internalError);

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith(internalError);
    expect(result).toBe(internalError);

    // Cleanup
    consoleSpy.mockRestore();
  });
});
