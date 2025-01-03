import { Args, Query, Resolver } from '@nestjs/graphql';
import { AnswerModel } from '../models/answer.model';
import { ListAnswersInput } from '../inputs/list-answers.input';
import { AnswersListResponseDataModel } from '../models/answers-list-response-data.model';
import { ListAnswersService } from '@modules/answer/services/list-answers.service';

@Resolver(() => AnswerModel)
export class ListAnswersResolver {
  constructor(private readonly listAnswersService: ListAnswersService) {}

  @Query(() => AnswersListResponseDataModel)
  async listAnswers(
    @Args('listAnswersData') listAnswersData: ListAnswersInput,
  ): Promise<AnswersListResponseDataModel> {
    // Execute service
    return await this.listAnswersService.execute({
      filter: listAnswersData.filter,
      limit: listAnswersData.limit,
      page: listAnswersData.page,
      orderBy: listAnswersData.orderBy,
    });
  }
}
