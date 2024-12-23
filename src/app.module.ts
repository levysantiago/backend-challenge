import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ChallengeModule } from './modules/challenge/challenge.module';
import { ProvidersModule } from '@shared/providers/providers.module';

@Module({
  imports: [
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
    ProvidersModule,
    ChallengeModule,
  ],
  providers: [AppResolver, AppService],
})
export class AppModule {}
