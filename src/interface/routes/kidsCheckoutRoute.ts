import { Router, Request, Response, NextFunction } from 'express';
import { KidsCheckoutController } from '../controllers/kidsCheckout.controller';
import { GetExperienceKid } from '../../usecases/kid_experience/getExperience';
import { ManageKidRepository } from '../../infrastructure/repositories/kid/ManageKidRepository';
import { experienceUpdateValidation } from '../../domain/interfaces/middleware/experienceUpdateValidation';
import { UpdateExperienceKid } from '../../usecases/kid_experience/updateExperience';

const router = Router();

const manageKidRepository = new ManageKidRepository();
const getExperienceKid = new GetExperienceKid(manageKidRepository);
const updateExperienceKid = new UpdateExperienceKid(manageKidRepository);

const kidsCheckoutController = new KidsCheckoutController(
  getExperienceKid,
  updateExperienceKid,
);

router.get('/experience', (req: Request, res: Response, next: NextFunction) =>
  kidsCheckoutController.getExperienceData(req, res, next),
);

router.put(
  '/updateExperience',
  [...experienceUpdateValidation],
  (req: Request, res: Response, next: NextFunction) =>
    kidsCheckoutController.updateExperienceData(req, res, next),
);

export { router as kidsCheckoutRoutes };
