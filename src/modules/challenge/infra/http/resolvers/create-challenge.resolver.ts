import { CreateChallengeService } from '@modules/challenge/services/create-challenge.service';
import { ChallengeModel } from '../models/challenge.model';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateChallengeInput } from '../inputs/create-challenge.input';
import { ChallengeResponseDataModel } from '../models/challenge-response-data.model';

@Resolver(() => ChallengeModel)
export class CreateChallengeResolver {
  constructor(
    private readonly createChallengeService: CreateChallengeService,
  ) {}

  @Mutation(() => ChallengeResponseDataModel)
  async createChallenge(
    @Args('newChallengeData') newChallengeData: CreateChallengeInput,
  ): Promise<ChallengeResponseDataModel> {
    // Execute service
    return await this.createChallengeService.execute({
      title: newChallengeData.title,
      description: newChallengeData.description,
    });
  }
}
