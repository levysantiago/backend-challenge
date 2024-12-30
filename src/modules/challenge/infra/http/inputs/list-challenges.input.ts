import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, Max, Min, ValidateNested } from 'class-validator';
import { ChallengeFilterInput } from './challenge-filter.input';
import { Type } from 'class-transformer';

@InputType({ description: 'The input for list challenges operation.' })
export class ListChallengesInput {
  @Field(() => ChallengeFilterInput, { nullable: true })
  @ValidateNested()
  @Type(() => ChallengeFilterInput)
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
