import { NextFunction, Request, Response, Router } from 'express';
import { CreateTasks } from '../../usecases/tasks/create_tasks';
import { ManageTaskRepository } from '../../infrastructure/repositories/tasks/ManageTaskRepository';
import { TasksCheckoutController } from '../controllers/tasksCheckout.controller';
import { createTaskValidation } from '../../domain/interfaces/middleware/createTaskValidation';

const router = Router();

const manageTaskRepository = new ManageTaskRepository();

const createTask = new CreateTasks(manageTaskRepository);

const taskCheckoutController = new TasksCheckoutController(createTask);

router.post(
  '/createTask',
  [...createTaskValidation],
  (req: Request, res: Response, next: NextFunction) =>
    taskCheckoutController.createTaskData(req, res, next),
);

export { router as tasksCheckoutRoutes };
