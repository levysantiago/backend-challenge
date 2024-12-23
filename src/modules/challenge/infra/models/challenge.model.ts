import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'challenge' })
export class ChallengeModel {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field()
  createdAt: Date;
}
