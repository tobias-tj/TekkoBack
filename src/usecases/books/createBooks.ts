import { BookDTO } from '../../domain/interfaces/dto/books/BooksDto';
import { ManageBooksRepo } from '../../domain/interfaces/repositories/ManageBooksRepo';

export class CreateBooks {
  constructor(private manageBooks: ManageBooksRepo) {}

  async execute(book: BookDTO) {
    return await this.manageBooks.createBooks(book);
  }
}
