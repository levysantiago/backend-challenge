import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsIn, IsOptional, IsUUID } from 'class-validator';
import { AnswerStatus } from '../../types/answer-status';

@InputType({ description: 'Answer filter input data' })
export class AnswerFilterInput {
  @Field(() => String, { nullable: true })
  @IsUUID()
  @IsOptional()
  challengeId?: string;

  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  endDate?: Date;

  @Field(() => String, { nullable: true })
  @IsIn(['Pending', 'Error', 'Done'])
  @IsOptional()
  status?: AnswerStatus;
}
