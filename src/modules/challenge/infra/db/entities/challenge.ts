import { ICreateChallengeDTO } from '@modules/challenge/dtos/icreate-challenge.dto';
import { randomUUID } from 'node:crypto';

/**
 * The representation of Challenge DB registry in the application.
 */
export class Challenge {
  id: string;
  title: string;
  description: string;
  createdAt: Date;

  constructor(props: ICreateChallengeDTO, id?: string) {
    this.title = props.title;
    this.description = props.description;

    this.id = id ?? randomUUID();
    this.createdAt = props.createdAt ?? new Date();
  }
}
