import { Field, Int, ObjectType } from '@nestjs/graphql';
import { AnswerModel } from './answer.model';

@ObjectType({ description: 'Answers list response data' })
export class AnswersListResponseDataModel {
  @Field(() => Int, { description: 'The current page of the search.' })
  page: number;

  @Field(() => Int, {
    description: 'The amount of elements per page returned by the search.',
  })
  limit: number;

  @Field(() => Int, {
    description: 'The total elements that matches the filter of the search.',
  })
  total: number;

  @Field({
    defaultValue: 'asc',
    description:
      'The order you want for the searched data, can be "asc" or "desc".',
  })
  orderBy?: 'asc' | 'desc';

  @Field(() => [AnswerModel], {
    description: 'The data containing the list of answers',
  })
  data: Array<AnswerModel>;
}
