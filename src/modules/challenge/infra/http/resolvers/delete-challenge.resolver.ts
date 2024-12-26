import { ChallengeModel } from '../models/challenge.model';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ChallengeResponseDataModel } from '../models/challenge-response-data.model';
import { DeleteChallengeInput } from '../inputs/delete-challenge.input';
import { DeleteChallengeService } from '@modules/challenge/services/delete-challenge.service';

@Resolver(() => ChallengeModel)
export class DeleteChallengeResolver {
  constructor(
    private readonly deleteChallengeService: DeleteChallengeService,
  ) {}

  @Mutation(() => ChallengeResponseDataModel)
  async deleteChallenge(
    @Args('deleteChallengeData') deleteChallengeData: DeleteChallengeInput,
  ): Promise<ChallengeResponseDataModel> {
    // Execute service
    return await this.deleteChallengeService.execute({
      id: deleteChallengeData.id,
    });
  }
}
