import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { AnswerStatus } from '../../types/answer-status';
import { ChallengeDataModel } from './challenge-data.model';

/**
 * The Answer object received from the client via GraphQL HTTP route.
 */
@ObjectType({ description: 'Answer model' })
export class AnswerModel {
  @Field(() => ID, { description: 'The Answer unique UUID identifier.' })
  id: string;

  @Field(() => String, {
    description: 'The Challenge ID which this Answer is related.',
  })
  challengeId: string;

  @Field(() => String, {
    description: 'The GitHub repository URL of the Answer.',
  })
  repositoryUrl: string;

  @Field(() => String, {
    description:
      'The status of the Answer. Can be "Pending", "Error" or "Done".',
  })
  status: AnswerStatus;

  @Field(() => Int, {
    nullable: true,
    description:
      'The grade result of the Answer. Starts with "null" when created, after the correction is done, a number is assigned to it.',
  })
  grade: number | null;

  @Field(() => Date, {
    description: 'The Answer creation ISO String Date.',
  })
  createdAt: Date;

  @Field(() => ChallengeDataModel, {
    nullable: true,
    description: 'The Challenge data returned by the relation with the Answer.',
  })
  challenge?: ChallengeDataModel;
}
