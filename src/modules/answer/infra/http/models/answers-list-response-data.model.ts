import { Field, Int, ObjectType } from '@nestjs/graphql';
import { AnswerModel } from './answer.model';

@ObjectType({ description: 'Answers list response data' })
export class AnswersListResponseDataModel {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  total: number;

  @Field({ defaultValue: 'asc' })
  orderBy?: 'asc' | 'desc';

  @Field(() => [AnswerModel], { description: 'List of answers' })
  data: Array<AnswerModel>;
}
