export interface IListChallengesDTO {
  orderBy?: 'asc' | 'desc';
  limit?: number;
  page?: number;

  filter: {
    title?: string;
    description?: string;
  };
}
