import { CreateChallengeService } from '@modules/challenge/services/create-challenge.service';
import { ChallengeModel } from '../models/challenge.model';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateChallengeResponseModel } from '../models/create-challenge-response.model';
// import { CreateChallengeInput } from './validations/create-challenge-validation.pipe';
import { CreateChallengeInput } from '../inputs/create-challenge.input';

@Resolver(() => ChallengeModel)
export class CreateChallengeResolver {
  constructor(
    private readonly createChallengeService: CreateChallengeService,
  ) {}

  @Mutation(() => CreateChallengeResponseModel)
  async createChallenge(
    @Args('newChallengeData') newChallengeData: CreateChallengeInput,
  ): Promise<CreateChallengeResponseModel> {
    // Execute service
    return await this.createChallengeService.execute({
      title: newChallengeData.title,
      description: newChallengeData.description,
    });
  }
}
