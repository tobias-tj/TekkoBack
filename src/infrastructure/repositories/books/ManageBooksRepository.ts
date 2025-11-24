import { BookDTO } from '../../../domain/interfaces/dto/books/BooksDto';
import { GetBooksDTO } from '../../../domain/interfaces/dto/books/GetBooksDto';
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

  async getBooks(
    level: number,
    page: number,
    limit: number,
  ): Promise<{ books: GetBooksDTO[]; total: number; error?: string }> {
    const client = await pool.connect();

    try {
      const offset = (page - 1) * limit;

      // 1️⃣ Contar total de libros
      const countSql = `
      SELECT COUNT(*) AS total
      FROM Libros
      WHERE nivel_id = $1
    `;

      const countResult = await client.query(countSql, [level]);
      const total = Number(countResult.rows[0].total);

      const sql = `
        SELECT 
          libro_id,
          titulo,
          descripcion,
          portada,
          nivel_id,
          total_paginas
        FROM Libros
        WHERE nivel_id = $1
        ORDER BY libro_id ASC
        LIMIT $2 OFFSET $3
      `;

      const result = await client.query(sql, [level, limit, offset]);

      if (!result.rows.length) {
        logger.warn(`No hay libros encontrados`);
        return { books: [], total: 0, error: 'NO_BOOKS' };
      }

      const books: GetBooksDTO[] = result.rows.map((row) => ({
        libroId: row.libro_id,
        nivelId: row.nivel_id,
        titulo: row.titulo,
        descripcion: row.descripcion,
        totalPaginas: row.total_paginas,
        portada: row.portada,
      }));

      logger.info(`Libros obtenidos para nivel ${level}`);
      return { books, total };
    } catch (error) {
      logger.error(`Error al obtener libros para el nivel ${level}:`, error);
      return { books: [], total: 0, error: 'DATABASE_ERROR' };
    } finally {
      client.release();
    }
  }

  async getBookPdfById(
    libroId: number,
  ): Promise<{ pdf: Buffer | null; error?: string }> {
    const client = await pool.connect();
    try {
      const query = `
      SELECT pdf FROM libros WHERE libro_id = $1
    `;

      const result = await client.query(query, [libroId]);

      if (!result.rows.length) {
        return { pdf: null, error: 'BOOK_NOT_FOUND' };
      }

      return { pdf: result.rows[0].pdf };
    } catch (error) {
      logger.error('Error al obtener PDF del libro:', error);
      return { pdf: null, error: 'DATABASE_ERROR' };
    } finally {
      client.release();
    }
  }
}
