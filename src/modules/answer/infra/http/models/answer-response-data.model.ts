import { Field, ObjectType } from '@nestjs/graphql';
import { AnswerModel } from './answer.model';

@ObjectType({ description: 'Answer response data' })
export class AnswerResponseDataModel {
  @Field(() => AnswerModel, {
    nullable: true,
    description: 'The data containing the Answer object.',
  })
  data: AnswerModel;
}
