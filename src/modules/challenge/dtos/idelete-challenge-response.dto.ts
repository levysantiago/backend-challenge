import { Challenge } from '@modules/challenge/infra/db/entities/challenge';

export interface IDeleteChallengeResponseDTO {
  data: Challenge;
}
