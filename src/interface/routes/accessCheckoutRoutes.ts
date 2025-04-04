import { Router, Request, Response, NextFunction } from 'express';
import { AccessCheckoutController } from '../controllers/accessCheckout.controller';
import { ManageParentRepository } from '../../infrastructure/repositories/parent/ManageParentRepository';
import { ManageKidRepository } from '../../infrastructure/kid/ManageKidRepository';
import { RegisterParent } from '../../usecases/parent_register/register';
import { RegisterKid } from '../../usecases/kid_register/register';
import { parentRegisterValidation } from '../../domain/interfaces/middleware/parentRegisterValidation';
import { parentLoginValidation } from '../../domain/interfaces/middleware/parentLoginValidation';
import { LoginParent } from '../../usecases/parent_login/login';

const router = Router();

const manageParentRepository = new ManageParentRepository();
const manageKidRepository = new ManageKidRepository();
const registerParentUseCase = new RegisterParent(manageParentRepository);
const registerKidUseCase = new RegisterKid(manageKidRepository);
const loginParentUseCase = new LoginParent(manageParentRepository);

const accessCheckoutController = new AccessCheckoutController(
  registerParentUseCase,
  registerKidUseCase,
  loginParentUseCase,
);

router.get(
  '/login',
  [...parentLoginValidation],
  (req: Request, res: Response, next: NextFunction) =>
    accessCheckoutController.loginCheckoutProcess(req, res, next),
);

router.post(
  '/register',
  [...parentRegisterValidation],
  (req: Request, res: Response, next: NextFunction) =>
    accessCheckoutController.registerCheckoutProcess(req, res, next),
);

export { router as accessCheckoutRoutes };
