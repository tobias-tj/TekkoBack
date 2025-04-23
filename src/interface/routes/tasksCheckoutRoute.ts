import { NextFunction, Request, Response, Router } from 'express';
import { CreateTasks } from '../../usecases/tasks/create_tasks';
import { ManageTaskRepository } from '../../infrastructure/repositories/tasks/ManageTaskRepository';
import { TasksCheckoutController } from '../controllers/tasksCheckout.controller';
import { createTaskValidation } from '../../domain/interfaces/middleware/createTaskValidation';
import { updateStatusTaskValidation } from '../../domain/interfaces/middleware/updateStatusTaskValidation';
import { UpdateStatus } from '../../usecases/tasks/update_status';

const router = Router();

const manageTaskRepository = new ManageTaskRepository();

const createTask = new CreateTasks(manageTaskRepository);

const updateStatusTask = new UpdateStatus(manageTaskRepository);

const taskCheckoutController = new TasksCheckoutController(
  createTask,
  updateStatusTask,
);

router.post(
  '/createTask',
  [...createTaskValidation],
  (req: Request, res: Response, next: NextFunction) =>
    taskCheckoutController.createTaskData(req, res, next),
);

router.put(
  '/updateStatusTask',
  [...updateStatusTaskValidation],
  (req: Request, res: Response, next: NextFunction) =>
    taskCheckoutController.updateStatusTaskData(req, res, next),
);

export { router as tasksCheckoutRoutes };
