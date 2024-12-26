import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class DeleteChallengeInput {
  @Field(() => String)
  @IsUUID()
  id: string;
}