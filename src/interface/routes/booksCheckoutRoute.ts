import { Router, Request, Response, NextFunction } from 'express';
import { booksValidation } from '../../domain/interfaces/middleware/booksValidation';
import { BooksCheckoutController } from '../controllers/booksCheckout.controller';
import { ManageBooksRepository } from '../../infrastructure/repositories/books/ManageBooksRepository';
import { CreateBooks } from '../../usecases/books/createBooks';
import multer from 'multer';
import { ManageParentRepository } from '../../infrastructure/repositories/parent/ManageParentRepository';
import { ParentIsAdmin } from '../../usecases/admin/parentIsAdmin';

const router = Router();

const manageBooksRepository = new ManageBooksRepository();
const manageParentRepository = new ManageParentRepository();

const createBookUsecase = new CreateBooks(manageBooksRepository);
const isAdminUsecase = new ParentIsAdmin(manageParentRepository);

const booksCheckoutController = new BooksCheckoutController(
  createBookUsecase,
  isAdminUsecase,
);

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'portada') {
      // Acepta solo jpg o png
      if (!file.mimetype.startsWith('image/')) {
        return cb(
          new Error('Solo se permiten archivos de imagen para la portada'),
        );
      }
    } else if (file.fieldname === 'pdf') {
      // Acepta solo pdf
      if (file.mimetype !== 'application/pdf') {
        return cb(new Error('Solo se permiten archivos PDF'));
      }
    }
    cb(null, true);
  },
});

router.post(
  '/books/upload',
  [...booksValidation],
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'portada', maxCount: 1 },
  ]),
  (req: Request, res: Response, next: NextFunction) =>
    booksCheckoutController.createBooks(req, res, next),
);

export { router as booksCheckoutRouter };
