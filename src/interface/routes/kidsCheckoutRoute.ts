import { Router, Request, Response, NextFunction } from 'express';
import { KidsCheckoutController } from '../controllers/kidsCheckout.controller';
import { GetExperienceKid } from '../../usecases/kid_experience/getExperience';
import { ManageKidRepository } from '../../infrastructure/repositories/kid/ManageKidRepository';

const router = Router();

const manageKidRepository = new ManageKidRepository();
const getExperienceKid = new GetExperienceKid(manageKidRepository);

const kidsCheckoutController = new KidsCheckoutController(getExperienceKid);

router.get('/experience', (req: Request, res: Response, next: NextFunction) =>
  kidsCheckoutController.getExperienceData(req, res, next),
);

export { router as kidsCheckoutRoutes };
