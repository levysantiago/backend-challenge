import { Field, ObjectType } from '@nestjs/graphql';
import { ChallengeModel } from './challenge.model';

@ObjectType({ description: 'Challenge response data' })
export class ChallengeResponseDataModel {
  @Field(() => ChallengeModel, {
    nullable: true,
    description: 'The data containing the Challenge object.',
  })
  data: ChallengeModel;
}
