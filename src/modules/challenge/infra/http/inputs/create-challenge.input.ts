import { Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class CreateChallengeInput {
  @Field(() => String)
  @MaxLength(30, {
    message: 'title must be shorter than or equal to 30 characters',
  })
  title: string;

  @Field(() => String)
  @MaxLength(255, {
    message: 'description must be shorter than or equal to 255 characters',
  })
  description: string;
}
