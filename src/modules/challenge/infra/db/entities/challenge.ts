import { randomUUID } from 'node:crypto';
import { ICreateChallengeEntityDTO } from '../dtos/icreate-challenge-entity.dto';

/**
 * The Application representation of a Challenge.
 */
export class Challenge {
  id: string;
  title: string;
  description: string;
  createdAt: Date;

  constructor(props: ICreateChallengeEntityDTO, id?: string) {
    this.title = props.title;
    this.description = props.description;

    this.id = id ?? randomUUID();
    this.createdAt = props.createdAt ?? new Date();
  }
}
