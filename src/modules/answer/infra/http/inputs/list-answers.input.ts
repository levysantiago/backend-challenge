import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, Max, Min, ValidateNested } from 'class-validator';
import { AnswerFilterInput } from './answer-filter.input';
import { Type } from 'class-transformer';

@InputType({ description: 'The input for list answers operation.' })
export class ListAnswersInput {
  @Field(() => AnswerFilterInput, {
    nullable: true,
    description: 'The filters to be applied in the answers searching',
  })
  @ValidateNested()
  @Type(() => AnswerFilterInput)
  filter?: AnswerFilterInput;

  @Field(() => Int, {
    nullable: true,
    description:
      'The current page of the answers search you want to access, starting by first page = 1.',
  })
  @Min(1)
  page?: number;

  @Field(() => Int, {
    nullable: true,
    description: 'The amount of elements per page. Max is 100.',
  })
  @Max(100)
  limit?: number;

  @Field({
    nullable: true,
    defaultValue: 'asc',
    description:
      'The order you want for the searched data, can be "asc" or "desc".',
  })
  @IsIn(['asc', 'desc'])
  orderBy?: 'asc' | 'desc';
}
