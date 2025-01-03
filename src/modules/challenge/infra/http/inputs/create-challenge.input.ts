import { Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class CreateChallengeInput {
  @Field(() => String, {
    description:
      'Challenge title. Should be less than or equal to 30 characters.',
  })
  @MaxLength(30)
  title: string;

  @Field(() => String, {
    description:
      'Challenge description. Should be less than or equal to 255 characters.',
  })
  @MaxLength(255)
  description: string;
}
