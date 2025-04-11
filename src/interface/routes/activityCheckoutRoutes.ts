import { NextFunction, Request, Response, Router } from 'express';
import { ActivityCheckoutController } from '../controllers/activityCheckout.controller';
import { ManageActivityRepository } from '../../infrastructure/repositories/activity/ManageActivityRepository';
import { CreateActivityDetails } from '../../usecases/activity/createActivityDetails';
import { CreateActivity } from '../../usecases/activity/createActivity';
import { GetActivity } from '../../usecases/activity/getActivity';
import { GetActivityByKids } from '../../usecases/activity/getActivityByKid';
import { UpdateActivityStatusById } from '../../usecases/activity/updateActivityStatusById';

const router = Router();

const manageActivityRepository = new ManageActivityRepository();
const createActivityDetails = new CreateActivityDetails(
  manageActivityRepository,
);
const createActivity = new CreateActivity(manageActivityRepository);
const getActivity = new GetActivity(manageActivityRepository);
const getActivityKid = new GetActivityByKids(manageActivityRepository);
const updateActivityStatus = new UpdateActivityStatusById(
  manageActivityRepository,
);

const activityCheckoutController = new ActivityCheckoutController(
  createActivityDetails,
  createActivity,
  getActivity,
  getActivityKid,
  updateActivityStatus,
);

router.post(
  '/createActivity',
  (req: Request, res: Response, next: NextFunction) =>
    activityCheckoutController.createActivityData(req, res, next),
);

router.get(
  '/getAllActivity',
  (req: Request, res: Response, next: NextFunction) =>
    activityCheckoutController.getAllActivityData(req, res, next),
);

router.get(
  '/getActivityByKid',
  (req: Request, res: Response, next: NextFunction) =>
    activityCheckoutController.getActivityByKids(req, res, next),
);

router.put(
  '/updateActivityStatus',
  (req: Request, res: Response, next: NextFunction) =>
    activityCheckoutController.updateActivityStatus(req, res, next),
);

export { router as activityCheckoutRoutes };
