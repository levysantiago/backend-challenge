import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsIn, IsOptional, IsUUID } from 'class-validator';
import { AnswerStatus } from '../../types/answer-status';

@InputType({ description: 'Answer filter input data' })
export class AnswerFilterInput {
  @Field(() => String, {
    nullable: true,
    description: 'Filter answers by challenge ID.',
  })
  @IsUUID()
  @IsOptional()
  challengeId?: string;

  @Field(() => Date, {
    nullable: true,
    description:
      'To filter answers that was created after this date (included).',
  })
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @Field(() => Date, {
    nullable: true,
    description:
      'To filter answers that was created before this date (included).',
  })
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @Field(() => String, {
    nullable: true,
    description:
      'Filter answers by status. Can be "Pending", "Error" or "Done".',
  })
  @IsIn(['Pending', 'Error', 'Done'])
  @IsOptional()
  status?: AnswerStatus;
}
