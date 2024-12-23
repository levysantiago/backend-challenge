import { Field, ObjectType } from '@nestjs/graphql';
import { ChallengeModel } from './challenge.model';

@ObjectType({ description: 'create challenge response' })
export class CreateChallengeResponseModel {
  @Field(() => ChallengeModel, { nullable: true })
  data: ChallengeModel;
}
