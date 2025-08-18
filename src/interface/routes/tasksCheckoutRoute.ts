import { NextFunction, Request, Response, Router } from 'express';
import { CreateTasks } from '../../usecases/tasks/create_tasks';
import { ManageTaskRepository } from '../../infrastructure/repositories/tasks/ManageTaskRepository';
import { TasksCheckoutController } from '../controllers/tasksCheckout.controller';
import { createTaskValidation } from '../../domain/interfaces/middleware/createTaskValidation';
import { updateStatusTaskValidation } from '../../domain/interfaces/middleware/updateStatusTaskValidation';
import { UpdateStatus } from '../../usecases/tasks/update_status';
import { getTaskByKidsValidation } from '../../domain/interfaces/middleware/getTaskByKidsValidation';
import { GetTasksByKid } from '../../usecases/tasks/get_tasks_by_kid';
import { DeleteTasksByKid } from '../../usecases/tasks/delete_tasks_by_kid';

const router = Router();

const manageTaskRepository = new ManageTaskRepository();

const createTask = new CreateTasks(manageTaskRepository);

const updateStatusTask = new UpdateStatus(manageTaskRepository);

const getTasksByChildId = new GetTasksByKid(manageTaskRepository);

const deleteTaskByKid = new DeleteTasksByKid(manageTaskRepository);

const taskCheckoutController = new TasksCheckoutController(
  createTask,
  updateStatusTask,
  getTasksByChildId,
  deleteTaskByKid,
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

router.get('/getTaskByKid', (req: Request, res: Response, next: NextFunction) =>
  taskCheckoutController.getTaskByKids(req, res, next),
);

router.delete(
  '/deleteTaskByKid',
  (req: Request, res: Response, next: NextFunction) =>
    taskCheckoutController.deleteTaskByKid(req, res, next),
);

export { router as tasksCheckoutRoutes };
