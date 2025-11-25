import { ManageBooksRepo } from '../../domain/interfaces/repositories/ManageBooksRepo';

export class DeleteBlockBook {
  constructor(private manageBooks: ManageBooksRepo) {}

  async execute(childrenId: number, bookId: number) {
    return await this.manageBooks.deleteBlockBook(childrenId, bookId);
  }
}
