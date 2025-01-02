import { Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class CreateChallengeInput {
  @Field(() => String)
  @MaxLength(30)
  title: string;

  @Field(() => String)
  @MaxLength(255)
  description: string;
}
