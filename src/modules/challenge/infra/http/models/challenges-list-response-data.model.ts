import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ChallengeModel } from './challenge.model';

@ObjectType({ description: 'Challenges list response data' })
export class ChallengesListResponseDataModel {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  total: number;

  @Field({ defaultValue: 'asc' })
  orderBy?: 'asc' | 'desc';

  @Field(() => [ChallengeModel], { description: 'List of challenges' })
  data: Array<ChallengeModel>;
}
