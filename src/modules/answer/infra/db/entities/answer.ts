import { randomUUID } from 'node:crypto';
import { AnswerStatus } from '../../types/answer-status';
import { ICreateAnswerEntityDTO } from '../dtos/icreate-answer-entity.dto';

/**
 * The Application representation of an Answer.
 */
export class Answer {
  id: string;
  challengeId: string;
  repositoryUrl: string;
  status: AnswerStatus;
  grade: number;
  createdAt: Date;

  challenge?: {
    title: string;
  };

  constructor(props: ICreateAnswerEntityDTO, id?: string) {
    this.challengeId = props.challengeId;
    this.repositoryUrl = props.repositoryUrl;
    this.challenge = props.challenge || undefined;

    this.id = id ?? randomUUID();
    this.status = props.status ?? 'PENDING';
    this.grade = props.grade ?? null;
    this.createdAt = props.createdAt ?? new Date();
  }
}
