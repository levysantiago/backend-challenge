import { Catch } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { InternalServerError } from '../errors/internal-server.error';
import { LoggerProvider } from '@shared/providers/logger-provider/types/logger.provider';

@Catch(GraphQLError)
export class GraphQLHttpExceptionFilter implements GraphQLHttpExceptionFilter {
  constructor(private logger: LoggerProvider) {}

  catch(exception: GraphQLError) {
    // const gqlHost = GqlArgumentsHost.create(host);

    if (exception instanceof InternalServerError) {
      this.logger.error(exception);
    }

    // Format the error response for GraphQL
    return exception;
  }
}
