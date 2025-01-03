import { Field, ID, ObjectType } from '@nestjs/graphql';

/**
 * The Challenge object received from the client via GraphQL HTTP route.
 */
@ObjectType({ description: 'Challenge Model' })
export class ChallengeModel {
  @Field(() => ID, { description: 'The Challenge unique UUID identifier.' })
  id: string;

  @Field(() => String, { description: 'The Challenge Title.' })
  title: string;

  @Field(() => String, { description: 'The Challenge Description.' })
  description: string;

  @Field(() => Date, {
    description: 'The Challenge creation ISO String Date.',
  })
  createdAt: Date;
}
