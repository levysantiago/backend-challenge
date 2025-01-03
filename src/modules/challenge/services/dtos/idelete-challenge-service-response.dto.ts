import { Challenge } from '@modules/challenge/infra/db/entities/challenge';

export interface IDeleteChallengeServiceResponseDTO {
  data: Challenge;
}
