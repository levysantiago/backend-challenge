import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsUUID, MaxLength } from 'class-validator';

@InputType()
export class UpdateChallengeInput {
  @Field(() => String, {
    description: 'The ID of the Challenge to be updated.',
  })
  @IsUUID()
  id: string;

  @Field(() => String, {
    nullable: true,
    description:
      'The new "title" of the Challenge to be updated. Should be less than or equal to 30 characters',
  })
  @MaxLength(30)
  @IsOptional()
  title?: string;

  @Field(() => String, {
    nullable: true,
    description:
      'The new "description" of the Challenge to be updated. Should be less than or equal to 255 characters',
  })
  @IsOptional()
  @MaxLength(255)
  description?: string;
}
