import { ChallengeModel } from '../models/challenge.model';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { ListChallengesService } from '@modules/challenge/services/list-challenges.service';
import { ListChallengesInput } from '../inputs/list-challenges.input';
import { ChallengesListResponseDataModel } from '../models/challenges-list-response-data.model';

@Resolver(() => ChallengeModel)
export class ListChallengesResolver {
  constructor(private readonly listChallengeService: ListChallengesService) {}

  @Query(() => ChallengesListResponseDataModel)
  async listChallenges(
    @Args('listChallengesData') listChallengesData: ListChallengesInput,
  ): Promise<ChallengesListResponseDataModel> {
    console.log(listChallengesData);

    // Execute service
    return await this.listChallengeService.execute({
      filter: listChallengesData.filter,
      limit: listChallengesData.limit,
      page: listChallengesData.page,
      orderBy: listChallengesData.orderBy,
    });
  }
}
