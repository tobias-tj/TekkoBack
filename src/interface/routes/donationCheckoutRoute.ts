import { Router, Request, Response, NextFunction } from 'express';
import { DonationCheckoutController } from '../controllers/donationCheckout.Controller';

const router = Router();

const donationCheckoutController = new DonationCheckoutController();

router.post('/donation', (req: Request, res: Response, next: NextFunction) =>
  donationCheckoutController.createPaymentDonation(req, res, next),
);

export { router as donationCheckoutRoutes };
