import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { decodeToken } from '../../domain/interfaces/middleware/jwtMiddleware';
import { logger } from '../../infrastructure/logger';
import { CreateBooks } from '../../usecases/books/createBooks';
import { BookDTO } from '../../domain/interfaces/dto/books/BooksDto';
import { ParentIsAdmin } from '../../usecases/admin/parentIsAdmin';

export class BooksCheckoutController {
  constructor(
    private createBooksUsecase: CreateBooks,
    private parentIsAdmin: ParentIsAdmin,
  ) {}

  async createBooks(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const authHeader = req.headers.authorization;
      const token =
        authHeader && authHeader.startsWith('Bearer ')
          ? authHeader.substring(7)
          : null;

      if (!token) return res.status(401);

      const decoded = decodeToken(token);

      if (!decoded?.parentId || !decoded?.email) {
        return res
          .status(401)
          .json({ error: 'Error autenticando Token, faltan datos' });
      }

      const isAdmin = await this.parentIsAdmin.execute(
        Number(decoded.parentId),
      );

      if (!isAdmin) {
        return res
          .status(401)
          .json({ error: 'No tienes acceso a este recurso' });
      }

      const { titulo, descripcion, totalPaginas, nivelId } = req.body;

      const pdfFile = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )?.['pdf']?.[0];
      const portadaFile = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )?.['portada']?.[0];

      if (!pdfFile || !portadaFile) {
        return res.status(400).json({ error: 'Faltan archivos PDF o portada' });
      }

      const book: BookDTO = {
        nivelId: Number(nivelId),
        titulo,
        descripcion,
        totalPaginas: Number(totalPaginas),
        pdf: pdfFile.buffer,
        portada: portadaFile.buffer,
      };

      const result = await this.createBooksUsecase.execute(book);

      if (!result) {
        return res.status(400).json({
          success: false,
          message: 'Failed to create book',
        });
      }

      logger.info(`Agregado con exito el libro: ${book.titulo}`);

      return res.status(201).json({
        sucess: true,
        message: 'El libro agregado correctamente',
      });
    } catch (error) {
      logger.error('Error en booksCreate error:', error);
      next(error);
    }
  }
}
