import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, Max, Min, ValidateNested } from 'class-validator';
import { AnswerFilterInput } from './answer-filter.input';
import { Type } from 'class-transformer';

@InputType({ description: 'The input for list answers operation.' })
export class ListAnswersInput {
  @Field(() => AnswerFilterInput)
  @ValidateNested()
  @Type(() => AnswerFilterInput)
  filter?: AnswerFilterInput;

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
