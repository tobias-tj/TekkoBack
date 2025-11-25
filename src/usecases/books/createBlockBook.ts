import { ManageBooksRepo } from '../../domain/interfaces/repositories/ManageBooksRepo';

export class CreateBlockBook {
  constructor(private manageBooks: ManageBooksRepo) {}

  async execute(childrenId: number, bookId: number) {
    return await this.manageBooks.createBlockBook(childrenId, bookId);
  }
}
