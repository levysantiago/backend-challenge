import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class DeleteChallengeInput {
  @Field(() => String, {
    description: 'The ID of the challenge to be deleted.',
  })
  @IsUUID()
  id: string;
}
