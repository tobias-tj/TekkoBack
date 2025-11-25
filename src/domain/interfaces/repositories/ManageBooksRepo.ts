import { BookDTO } from '../dto/books/BooksDto';
import { GetBooksDTO } from '../dto/books/GetBooksDto';
import { GetBooksKidDTO } from '../dto/books/GetBooksKidDto';

export interface ManageBooksRepo {
  createBooks(books: BookDTO): Promise<boolean>;
  getBooksForParent(
    level: number,
    page: number,
    limit: number,
    childrenId: number,
  ): Promise<{ books: GetBooksDTO[]; total: number; error?: string }>;
  getBookPdfById(
    libroId: number,
  ): Promise<{ pdf: Buffer | null; error?: string }>;
  createBlockBook(
    childrenId: number,
    bookId: number,
  ): Promise<'CREATED' | 'EXISTS' | 'ERROR'>;
  deleteBlockBook(childrenId: number, bookId: number): Promise<boolean>;
  getBooksKid(
    level: number,
    page: number,
    limit: number,
    childrenId: number,
  ): Promise<{ books: GetBooksKidDTO[]; total: number; error?: string }>;
}
