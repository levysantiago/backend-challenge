import { Field, ID, ObjectType } from '@nestjs/graphql';

/**
 * The Challenge object received from the client via GraphQL HTTP route.
 */
@ObjectType({ description: 'challenge' })
export class ChallengeModel {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => Date)
  createdAt: Date;
}
