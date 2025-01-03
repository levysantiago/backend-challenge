import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, MaxLength } from 'class-validator';

@InputType({ description: 'Challenge filter input data' })
export class ChallengeFilterInput {
  @Field(() => String, {
    nullable: true,
    description:
      'A string that might contain in the original challenge title. Should be less than or equal to 30 characters.',
  })
  @MaxLength(30)
  @IsOptional()
  title?: string;

  @Field(() => String, {
    nullable: true,
    description:
      'A string that might contain in the original challenge description. Should be less than or equal to 255 characters.',
  })
  @MaxLength(255)
  @IsOptional()
  description?: string;
}
