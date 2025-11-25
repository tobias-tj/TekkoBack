import { BookDTO } from '../../../domain/interfaces/dto/books/BooksDto';
import { GetBooksDTO } from '../../../domain/interfaces/dto/books/GetBooksDto';
import { GetBooksKidDTO } from '../../../domain/interfaces/dto/books/GetBooksKidDto';
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

  async getBooksForParent(
    level: number,
    page: number,
    limit: number,
    childrenId: number,
  ): Promise<{ books: GetBooksDTO[]; total: number; error?: string }> {
    const client = await pool.connect();

    try {
      const offset = (page - 1) * limit;

      // 1️⃣ Contar total de libros
      const countSql = `
      SELECT COUNT(*) AS total
      FROM libros
      WHERE nivel_id = $1
    `;
      const countResult = await client.query(countSql, [level]);
      const total = Number(countResult.rows[0].total);

      // 2️⃣ Obtener libros + bandera de bloqueo
      const sql = `
      SELECT 
        l.libro_id,
        l.titulo,
        l.descripcion,
        l.portada,
        l.nivel_id,
        l.total_paginas,

        CASE 
            WHEN lb.libro_id IS NOT NULL THEN FALSE
            ELSE TRUE
        END AS is_visible

      FROM libros l
      LEFT JOIN libros_bloqueados lb 
        ON lb.libro_id = l.libro_id AND lb.children_id = $4

      WHERE l.nivel_id = $1
      ORDER BY l.libro_id ASC
      LIMIT $2 OFFSET $3
    `;

      const result = await client.query(sql, [
        level,
        limit,
        offset,
        childrenId,
      ]);

      const books: GetBooksDTO[] = result.rows.map((row) => ({
        libroId: row.libro_id,
        nivelId: row.nivel_id,
        titulo: row.titulo,
        descripcion: row.descripcion,
        totalPaginas: row.total_paginas,
        portada: row.portada,
        isVisible: row.is_visible,
      }));

      return { books, total };
    } catch (error) {
      logger.error('Error al obtener libros:', error);
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

  async createBlockBook(
    childrenId: number,
    bookId: number,
  ): Promise<'CREATED' | 'EXISTS' | 'ERROR'> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const query = `
      INSERT INTO libros_bloqueados (children_id, libro_id)
      VALUES ($1, $2)
      ON CONFLICT (children_id, libro_id)
      DO NOTHING
      RETURNING id;
    `;

      const result = await client.query(query, [childrenId, bookId]);
      await client.query('COMMIT');

      if (result.rows.length === 0) {
        // No hay return → ya existía
        return 'EXISTS';
      }

      return 'CREATED';
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error al bloquear libro:', error);
      return 'ERROR';
    } finally {
      client.release();
    }
  }

  async deleteBlockBook(childrenId: number, bookId: number): Promise<boolean> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const query = `
      DELETE FROM libros_bloqueados
      WHERE children_id = $1 AND libro_id = $2
    `;

      const result = await client.query(query, [childrenId, bookId]);

      await client.query('COMMIT');

      if (result.rowCount === 0) {
        logger.warn(`No se encontro libro a desbloquear ID: ${bookId}`);
        return false;
      }
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error al desbloquear libro:', error);
      return false;
    } finally {
      client.release();
    }
  }

  async getBooksKid(
    level: number,
    page: number,
    limit: number,
    childrenId: number,
  ): Promise<{ books: GetBooksKidDTO[]; total: number; error?: string }> {
    const client = await pool.connect();

    try {
      const offset = (page - 1) * limit;

      // 1️⃣ Contar cuántos libros reales tiene el niño sin bloqueos
      const countSql = `
      SELECT COUNT(*) AS total
      FROM libros l
      WHERE l.nivel_id = $1
      AND l.libro_id NOT IN (
        SELECT libro_id 
        FROM libros_bloqueados 
        WHERE children_id = $2
      )
    `;
      const countResult = await client.query(countSql, [level, childrenId]);
      const total = Number(countResult.rows[0].total);

      // 2️⃣ Obtener página actual
      const sql = `
      SELECT 
        l.libro_id,
        l.titulo,
        l.descripcion,
        l.portada,
        l.nivel_id,
        l.total_paginas
      FROM libros l
      WHERE l.nivel_id = $1
      AND l.libro_id NOT IN (
        SELECT libro_id 
        FROM libros_bloqueados 
        WHERE children_id = $4
      )
      ORDER BY l.libro_id ASC
      LIMIT $2 OFFSET $3
    `;

      const result = await client.query(sql, [
        level,
        limit,
        offset,
        childrenId,
      ]);

      const books: GetBooksKidDTO[] = result.rows.map((row) => ({
        libroId: row.libro_id,
        nivelId: row.nivel_id,
        titulo: row.titulo,
        descripcion: row.descripcion,
        totalPaginas: row.total_paginas,
        portada: row.portada,
      }));

      return { books, total };
    } catch (error) {
      logger.error('Error en getBooksForChild:', error);
      return { books: [], total: 0, error: 'DATABASE_ERROR' };
    } finally {
      client.release();
    }
  }
}
