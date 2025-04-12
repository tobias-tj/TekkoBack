import { NextFunction, Request, Response, Router } from 'express';
import { ManageSettingsRepository } from '../../infrastructure/repositories/settings/ManageSettingsRepository';
import { GetDetailsProfile } from '../../usecases/settings/get_details_profile';
import { SettingsCheckoutController } from '../controllers/settingsCheckout.controller';
import { UpdateProfileData } from '../../usecases/settings/update_profile_data';

const router = Router();

const manageSettingRepository = new ManageSettingsRepository();

const getProfileDetails = new GetDetailsProfile(manageSettingRepository);

const updateProfileDetails = new UpdateProfileData(manageSettingRepository);

const settingsCheckoutController = new SettingsCheckoutController(
  getProfileDetails,
  updateProfileDetails,
);

router.get(
  '/getProfileDetails',
  (req: Request, res: Response, next: NextFunction) =>
    settingsCheckoutController.getDetailsProfile(req, res, next),
);

router.put(
  '/updateProfile',
  (req: Request, res: Response, next: NextFunction) =>
    settingsCheckoutController.updateProfile(req, res, next),
);

export { router as settingsCheckoutRoutes };
