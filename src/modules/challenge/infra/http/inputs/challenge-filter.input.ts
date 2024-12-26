import { Field, InputType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@InputType({ description: 'Challenge filter input data' })
export class ChallengeFilterInput {
  @Field(() => String, { nullable: true })
  @MaxLength(30)
  title?: string;

  @Field(() => String, { nullable: true })
  @MaxLength(255)
  description?: string;
}
