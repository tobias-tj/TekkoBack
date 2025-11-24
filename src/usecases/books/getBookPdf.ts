import { ManageBooksRepo } from '../../domain/interfaces/repositories/ManageBooksRepo';

export class GetBookPdf {
  constructor(private manageBooks: ManageBooksRepo) {}

  async execute(libroId: number) {
    return await this.manageBooks.getBookPdfById(libroId);
  }
}
