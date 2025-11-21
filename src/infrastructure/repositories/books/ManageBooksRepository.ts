import { BookDTO } from '../../../domain/interfaces/dto/books/BooksDto';
import { ManageBooksRepo } from '../../../domain/interfaces/repositories/ManageBooksRepo';
import { pool } from '../../database/dbConnection';
import { logger } from '../../logger';

export class ManageBooksRepository implements ManageBooksRepo {
  async createBooks(books: BookDTO): Promise<boolean> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const query = `
          INSERT INTO libros (nivel_id, titulo, descripcion, total_paginas, pdf, portada)
        VALUES ($1, $2, $3, $4, $5, $6)
        `;
      const values = [
        books.nivelId,
        books.titulo,
        books.descripcion,
        books.totalPaginas,
        books.pdf,
        books.portada,
      ];

      await client.query(query, values);

      await client.query('COMMIT');
      return true;
    } catch (error: any) {
      await client.query('ROLLBACK');
      logger.error('Error al guardar el libro:', error);
      return false;
    } finally {
      client.release();
    }
  }
}
