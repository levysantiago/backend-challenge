import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';

@InputType()
export class UpdateChallengeInput {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  @MaxLength(30)
  @IsOptional()
  title?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @MaxLength(255)
  description?: string;
}
