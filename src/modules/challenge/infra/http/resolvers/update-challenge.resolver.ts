import { ChallengeModel } from '../models/challenge.model';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UpdateChallengeService } from '@modules/challenge/services/update-challenge.service';
import { UpdateChallengeInput } from '../inputs/update-challenge.input';
import { ChallengeResponseDataModel } from '../models/challenge-response-data.model';

@Resolver(() => ChallengeModel)
export class UpdateChallengeResolver {
  constructor(
    private readonly updateChallengeService: UpdateChallengeService,
  ) {}

  @Mutation(() => ChallengeResponseDataModel)
  async updateChallenge(
    @Args('updateChallengeData') updateChallengeData: UpdateChallengeInput,
  ): Promise<ChallengeResponseDataModel> {
    // Execute service
    return await this.updateChallengeService.execute({
      id: updateChallengeData.id,
      data: {
        title: updateChallengeData.title,
        description: updateChallengeData.description,
      },
    });
  }
}
