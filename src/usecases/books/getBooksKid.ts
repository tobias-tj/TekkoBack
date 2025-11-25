import { ManageBooksRepo } from '../../domain/interfaces/repositories/ManageBooksRepo';

export class GetBookKid {
  constructor(private manageBooks: ManageBooksRepo) {}

  async execute(
    level: number,
    page: number,
    limit: number,
    childrenId: number,
  ) {
    return await this.manageBooks.getBooksKid(level, page, limit, childrenId);
  }
}
