import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ChallengeModule } from './modules/challenge/challenge.module';
import { ProvidersModule } from '@shared/providers/providers.module';
import { AnswerModule } from '@modules/answer/answer.module';
import { DateScalar } from '@shared/infra/scalar-types/date.scalar';
import { HeartbeatModule } from '@modules/heartbeat/heartbeat.module';

@Module({
  imports: [
    // Configure GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      formatError: (error) => {
        const graphQLFormattedError = {
          message: error.message,
          code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
          path: error.path || [],
          details: error.extensions?.originalError || undefined,
        };
        return graphQLFormattedError;
      },
    }),

    // Scalar types
    DateScalar,

    // Providers
    ProvidersModule,

    // Modules
    HeartbeatModule,
    ChallengeModule,
    AnswerModule,
  ],
})
export class AppModule {}
