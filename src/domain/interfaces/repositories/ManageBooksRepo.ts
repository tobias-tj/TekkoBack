import { BookDTO } from '../dto/books/BooksDto';

export interface ManageBooksRepo {
  createBooks(books: BookDTO): Promise<boolean>;
}
