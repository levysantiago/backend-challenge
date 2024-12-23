import { Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType()
export class CreateChallengeInput {
  @Field()
  @MaxLength(30)
  title: string;

  @Field()
  @MaxLength(255)
  description: string;
}
