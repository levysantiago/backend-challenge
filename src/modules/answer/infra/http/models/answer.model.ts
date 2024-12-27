import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { AnswerStatus } from '../../types/answer-status';
import { ChallengeDataModel } from './challenge-data.model';

/**
 * The Answer object received from the client via GraphQL HTTP route.
 */
@ObjectType({ description: 'Answer model' })
export class AnswerModel {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  challengeId: string;

  @Field(() => String)
  repositoryUrl: string;

  @Field(() => String)
  status: AnswerStatus;

  @Field(() => Int, { nullable: true })
  grade: number | null;

  @Field()
  createdAt: Date;

  @Field(() => ChallengeDataModel, { nullable: true })
  challenge?: ChallengeDataModel;
}
