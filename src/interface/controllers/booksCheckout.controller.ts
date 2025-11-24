import { validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { decodeToken } from '../../domain/interfaces/middleware/jwtMiddleware';
import { logger } from '../../infrastructure/logger';
import { CreateBooks } from '../../usecases/books/createBooks';
import { BookDTO } from '../../domain/interfaces/dto/books/BooksDto';
import { ParentIsAdmin } from '../../usecases/admin/parentIsAdmin';
import { GetBooksByLevel } from '../../usecases/books/getBooksByLevel';
import { GetBookPdf } from '../../usecases/books/getBookPdf';
import { GetExperienceKid } from '../../usecases/kid_experience/getExperience';

export class BooksCheckoutController {
  constructor(
    private createBooksUsecase: CreateBooks,
    private parentIsAdmin: ParentIsAdmin,
    private getBooksByLevelUsecase: GetBooksByLevel,
    private getBookPdfUsecase: GetBookPdf,
    private getExperienceUsecase: GetExperienceKid,
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

      const { titulo, descripcion, totalPaginas, nivelId, portadaFileLink } =
        req.body;

      const pdfFile = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )?.['pdf']?.[0];

      if (!pdfFile) {
        return res.status(400).json({ error: 'Falta archivo PDF' });
      }

      const book: BookDTO = {
        nivelId: Number(nivelId),
        titulo,
        descripcion,
        totalPaginas: Number(totalPaginas),
        pdf: pdfFile.buffer,
        portada: portadaFileLink,
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

  async getBooksByLevel(req: Request, res: Response, next: NextFunction) {
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
      if (!token) return res.status(401).json({ error: 'Token no válido' });

      const decoded = decodeToken(token);
      logger.info(decoded);

      if (!decoded?.parentId || !decoded?.childrenId || !decoded?.email) {
        return res
          .status(401)
          .json({ error: 'Error autenticando Token, faltan datos' });
      }

      logger.info(`Obteniendo libros para parent_id: ${decoded.parentId}`);

      // Obtener nivel real del niño
      // -------------------------
      const expInfo = await this.getExperienceUsecase.execute(
        decoded.childrenId,
      );
      const realLevel = Number(expInfo.level);

      // -------------------------
      // Leer parámetros
      // -------------------------
      const requestedLevel = req.query.level
        ? Number(req.query.level)
        : realLevel;

      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 1;

      // -------------------------
      // Validación de seguridad
      // -------------------------
      if (requestedLevel > realLevel) {
        return res.status(403).json({
          success: false,
          message: `No tienes permitido acceder al nivel ${requestedLevel}. Tu nivel actual es ${realLevel}`,
        });
      }

      const result = await this.getBooksByLevelUsecase.execute(
        Number(requestedLevel),
        page,
        limit,
      );

      const totalPages = Math.ceil(result.total / limit);

      return res.status(200).json({
        success: true,
        currentLevel: realLevel,
        requestedLevel,
        pagination: {
          page,
          limit,
          hasMore: page < totalPages,
        },
        data: result.books,
      });
    } catch (error) {
      logger.error('Error en getBooksByLevel:', error);
      next(error);
    }
  }

  async getBookPdf(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;

      const authHeader = req.headers.authorization;

      const token =
        authHeader && authHeader.startsWith('Bearer ')
          ? authHeader.substring(7)
          : null;
      if (!token) {
        return res.status(401);
      }

      const decoded = decodeToken(token);
      logger.info(decoded);

      if (!decoded?.parentId || !decoded?.childrenId || !decoded?.email) {
        return res
          .status(401)
          .json({ error: 'Error autenticando Token, faltan datos' });
      }

      logger.info(`Obteniendo pdf para el libro: ${id}`);

      const result = await this.getBookPdfUsecase.execute(Number(id));

      res.setHeader('Content-Type', 'application/pdf');
      res.send(result.pdf);
    } catch (error) {
      logger.error('Error en getBookPdf:', error);
      next(error);
    }
  }
}
