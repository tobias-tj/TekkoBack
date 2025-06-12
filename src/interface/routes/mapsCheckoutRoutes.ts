import { NextFunction, Request, Response, Router } from 'express';
import { ManageMapsRepository } from '../../infrastructure/repositories/maps/ManageMapsRepository';
import { CreateMapsInformation } from '../../usecases/maps/createMapsInformation';
import { MapsCheckoutController } from '../controllers/mapsCheckout.controller';
import { mapsCreateValidation } from '../../domain/interfaces/middleware/mapsCreateValidation';
import { GetMapsInformation } from '../../usecases/maps/getMapsInformation';
import { mapsGetValidation } from '../../domain/interfaces/middleware/mapsGetValidation';
import { UpdateMapsInformation } from '../../usecases/maps/updateMapsInformation';
import { mapsUpdateValidation } from '../../domain/interfaces/middleware/mapsUpdateValidation';

const router = Router();

const manageMapsRepository = new ManageMapsRepository();

const createMapsInformation = new CreateMapsInformation(manageMapsRepository);

const getMapsInformation = new GetMapsInformation(manageMapsRepository);

const updateMapsInformation = new UpdateMapsInformation(manageMapsRepository);

const manageMapsController = new MapsCheckoutController(
  createMapsInformation,
  getMapsInformation,
  updateMapsInformation,
);

router.post(
  '/createMaps',
  [...mapsCreateValidation],
  (req: Request, res: Response, next: NextFunction) =>
    manageMapsController.createMapsData(req, res, next),
);

router.get(
  '/getMapByParent',
  [...mapsGetValidation],
  (req: Request, res: Response, next: NextFunction) =>
    manageMapsController.getMapByParent(req, res, next),
);

router.put(
  '/updateMaps',
  [...mapsUpdateValidation],
  (req: Request, res: Response, next: NextFunction) =>
    manageMapsController.updateInformationMap(req, res, next),
);

export { router as mapsCheckoutRoutes };
