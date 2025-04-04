import { Router, Request, Response, NextFunction } from 'express';
import { KidsCheckoutController } from '../controllers/kidsCheckout.controller';
import { ManageKidRepository } from '../../infrastructure/kid/ManageKidRepository';
import { GetExperienceKid } from '../../usecases/kid_experience/getExperience';

const router = Router();

const manageKidRepository = new ManageKidRepository();
const getExperienceKid = new GetExperienceKid(manageKidRepository);

const kidsCheckoutController = new KidsCheckoutController(getExperienceKid);

router.get('/experience', (req: Request, res: Response, next: NextFunction) =>
  kidsCheckoutController.getExperienceData(req, res, next),
);

export { router as kidsCheckoutRoutes };
