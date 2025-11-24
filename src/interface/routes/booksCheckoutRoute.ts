import { Router, Request, Response, NextFunction } from 'express';
import { booksValidation } from '../../domain/interfaces/middleware/booksValidation';
import { BooksCheckoutController } from '../controllers/booksCheckout.controller';
import { ManageBooksRepository } from '../../infrastructure/repositories/books/ManageBooksRepository';
import { CreateBooks } from '../../usecases/books/createBooks';
import multer from 'multer';
import { ManageParentRepository } from '../../infrastructure/repositories/parent/ManageParentRepository';
import { ParentIsAdmin } from '../../usecases/admin/parentIsAdmin';
import { GetBooksByLevel } from '../../usecases/books/getBooksByLevel';
import { GetBookPdf } from '../../usecases/books/getBookPdf';
import { getBooksByLevelValidator } from '../../domain/interfaces/middleware/getBooksByLevelValidation';
import { getBookPdfValidator } from '../../domain/interfaces/middleware/getBookPdfValidation';
import { GetExperienceKid } from '../../usecases/kid_experience/getExperience';
import { ManageKidRepository } from '../../infrastructure/repositories/kid/ManageKidRepository';

const router = Router();

const manageBooksRepository = new ManageBooksRepository();
const manageParentRepository = new ManageParentRepository();
const manageKidRepository = new ManageKidRepository();

const createBookUsecase = new CreateBooks(manageBooksRepository);
const isAdminUsecase = new ParentIsAdmin(manageParentRepository);
const getBooksByLevelUsecase = new GetBooksByLevel(manageBooksRepository);
const getBookPdfUsecase = new GetBookPdf(manageBooksRepository);
const getExperienceUsecase = new GetExperienceKid(manageKidRepository);

const booksCheckoutController = new BooksCheckoutController(
  createBookUsecase,
  isAdminUsecase,
  getBooksByLevelUsecase,
  getBookPdfUsecase,
  getExperienceUsecase,
);

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'pdf') {
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
  upload.fields([{ name: 'pdf', maxCount: 1 }]),
  (req: Request, res: Response, next: NextFunction) =>
    booksCheckoutController.createBooks(req, res, next),
);

router.get(
  '/books/list',
  [...getBooksByLevelValidator],
  (req: Request, res: Response, next: NextFunction) =>
    booksCheckoutController.getBooksByLevel(req, res, next),
);

router.get(
  '/books/:id/pdf',
  [...getBookPdfValidator],
  (req: Request, res: Response, next: NextFunction) =>
    booksCheckoutController.getBookPdf(req, res, next),
);

export { router as booksCheckoutRouter };
