import { Router, Request, Response, NextFunction } from 'express';
import { AccessCheckoutController } from '../controllers/accessCheckout.controller';
import { ManageParentRepository } from '../../infrastructure/repositories/parent/ManageParentRepository';
import { RegisterParent } from '../../usecases/parent_register/register';
import { RegisterKid } from '../../usecases/kid_register/register';
import { parentRegisterValidation } from '../../domain/interfaces/middleware/parentRegisterValidation';
import { parentLoginValidation } from '../../domain/interfaces/middleware/parentLoginValidation';
import { LoginParent } from '../../usecases/parent_login/login';
import { PinSecurity } from '../../usecases/parent_pin/pin_security';
import { ParentPinSecurityValidation } from '../../domain/interfaces/middleware/parentPinSecurityValidation';
import { ManageKidRepository } from '../../infrastructure/repositories/kid/ManageKidRepository';
import { EmailConfirm } from '../../usecases/parent_email_confirm/emailConfirm';
import { ResetPassword } from '../../usecases/paren_reset_password/resetPassword';
import { MailService } from '../../infrastructure/email/MailServices';
import { ParentRecoveryValidation } from '../../domain/interfaces/middleware/parentRecoveryValidation';
import { senderPinValidation } from '../../domain/interfaces/middleware/senderPinValidation';
import { SendPinByEmail } from '../../usecases/send_pin_email/send_pin_by_email';

const router = Router();

const manageParentRepository = new ManageParentRepository();
const manageKidRepository = new ManageKidRepository();
const emailService = new MailService();
const registerParentUseCase = new RegisterParent(manageParentRepository);
const registerKidUseCase = new RegisterKid(manageKidRepository);
const loginParentUseCase = new LoginParent(manageParentRepository);
const securityPinParent = new PinSecurity(manageParentRepository);
const emailConfirmUseCase = new EmailConfirm(manageParentRepository);
const resetPasswordUseCase = new ResetPassword(
  manageParentRepository,
  emailService,
);
const sendPinEmailUseCase = new SendPinByEmail(
  manageParentRepository,
  emailService,
);

const accessCheckoutController = new AccessCheckoutController(
  registerParentUseCase,
  registerKidUseCase,
  loginParentUseCase,
  securityPinParent,
  emailConfirmUseCase,
  resetPasswordUseCase,
  sendPinEmailUseCase,
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

router.post(
  '/securityParent',
  [...ParentPinSecurityValidation],
  (req: Request, res: Response, next: NextFunction) =>
    accessCheckoutController.securityPin(req, res, next),
);

router.post(
  '/recoverAccount',
  [...ParentRecoveryValidation],
  (req: Request, res: Response, next: NextFunction) =>
    accessCheckoutController.recoverAccount(req, res, next),
);

router.post(
  '/senderPin',
  [...senderPinValidation],
  (req: Request, res: Response, next: NextFunction) =>
    accessCheckoutController.senderPinByEmail(req, res, next),
);

export { router as accessCheckoutRoutes };
