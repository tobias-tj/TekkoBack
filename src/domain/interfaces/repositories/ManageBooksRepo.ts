import { BookDTO } from '../dto/books/BooksDto';
import { GetBooksDTO } from '../dto/books/GetBooksDto';

export interface ManageBooksRepo {
  createBooks(books: BookDTO): Promise<boolean>;
  getBooks(
    level: number,
    page: number,
    limit: number,
  ): Promise<{ books: GetBooksDTO[]; total: number; error?: string }>;
  getBookPdfById(
    libroId: number,
  ): Promise<{ pdf: Buffer | null; error?: string }>;
}
