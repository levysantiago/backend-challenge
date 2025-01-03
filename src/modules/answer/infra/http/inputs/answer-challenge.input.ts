import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType({ description: 'Answer challenge input data' })
export class AnswerChallengeInput {
  @Field(() => String, {
    description: 'The ID of the challenge you are sending a new answer.',
  })
  @IsUUID()
  challengeId: string;

  @Field(() => String, {
    description: 'The GitHub repository URL of the answer.',
  })
  repositoryUrl: string;
}
