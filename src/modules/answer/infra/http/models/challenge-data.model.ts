import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({
  description: 'Data from the challenge the answer is related to.',
})
export class ChallengeDataModel {
  @Field(() => String, {
    description: 'The "title" of the Challenge the Answer is related to.',
  })
  title: string;
}
