import { Catch } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { InternalServerError } from '../errors/internal-server.error';

@Catch(GraphQLError)
export class GraphQLHttpExceptionFilter implements GraphQLHttpExceptionFilter {
  catch(exception: GraphQLError) {
    // const gqlHost = GqlArgumentsHost.create(host);

    if (exception instanceof InternalServerError) {
      console.log(exception);
    }

    // Format the error response for GraphQL
    return exception;
  }
}
