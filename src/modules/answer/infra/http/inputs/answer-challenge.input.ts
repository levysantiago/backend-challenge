import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType({ description: 'Answer challenge input data' })
export class AnswerChallengeInput {
  @Field(() => String)
  @IsUUID()
  challengeId: string;

  @Field(() => String)
  repositoryUrl: string;
}
