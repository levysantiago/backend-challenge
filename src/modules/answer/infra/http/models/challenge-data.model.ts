import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({
  description: 'Data from the challenge the answer is related to.',
})
export class ChallengeDataModel {
  @Field(() => String)
  title: string;
}
