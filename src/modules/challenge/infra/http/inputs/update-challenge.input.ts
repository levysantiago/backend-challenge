import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';

@InputType()
export class UpdateChallengeInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  @MaxLength(30)
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(255)
  description?: string;
}
