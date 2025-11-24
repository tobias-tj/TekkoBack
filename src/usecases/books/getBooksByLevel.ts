import { ManageBooksRepo } from '../../domain/interfaces/repositories/ManageBooksRepo';

export class GetBooksByLevel {
  constructor(private manageBooks: ManageBooksRepo) {}

  async execute(level: number, page: number, limit: number) {
    return await this.manageBooks.getBooks(level, page, limit);
  }
}
