import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, Max, Min } from 'class-validator';
import { ChallengeFilterInput } from './challenge-filter.input';

@InputType({ description: 'The input for list challenges operation.' })
export class ListChallengesInput {
  @Field()
  filter?: ChallengeFilterInput;

  @Field(() => Int, { nullable: true })
  @Min(1)
  page?: number;

  @Field(() => Int, { nullable: true })
  @Max(100)
  limit?: number;

  @Field({ nullable: true, defaultValue: 'asc' })
  @IsIn(['asc', 'desc'])
  orderBy?: 'asc' | 'desc';
}
