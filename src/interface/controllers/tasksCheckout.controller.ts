import { validationResult } from 'express-validator';
import { CreateTasks } from '../../usecases/tasks/create_tasks';
import { NextFunction, Request, Response } from 'express';
import { CreateTaskDto } from '../../domain/interfaces/dto/tasks/CreateTaskDto';
import { logger } from '../../infrastructure/logger';
import { UpdateStatus } from '../../usecases/tasks/update_status';
import { GetTasksByKid } from '../../usecases/tasks/get_tasks_by_kid';
import { GetTaskListByKidResponse } from '../../domain/interfaces/dto/tasks/GetTaskListByKidResponse';
import { decodeToken } from '../../domain/interfaces/middleware/jwtMiddleware';
import { DeleteTasksByKid } from '../../usecases/tasks/delete_tasks_by_kid';

export class TasksCheckoutController {
  constructor(
    private createTaskUseCase: CreateTasks,
    private updateStatusTaskUseCase: UpdateStatus,
    private getTasksByKidUseCase: GetTasksByKid,
    private deleteTaskByKidUseCase: DeleteTasksByKid,
  ) {}

  async createTaskData(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      logger.info('Comienza flujo createTaskData');

      const authHeader = req.headers.authorization;

      const token =
        authHeader && authHeader.startsWith('Bearer ')
          ? authHeader.substring(7)
          : null;

      if (!token) {
        return res.status(401);
      }

      const decoded = decodeToken(token);
      logger.info(decoded);

      if (!decoded?.parentId || !decoded?.childrenId || !decoded?.email) {
        return res
          .status(401)
          .json({ error: 'Error autenticando Token, faltan datos' });
      }

      logger.info('Validacion de token cumplida exitosamente');

      const { number1, number2, operation, correctAnswer } = req.body;

      const createTaskDto = new CreateTaskDto(
        Number(decoded.parentId),
        decoded.childrenId,
        number1,
        number2,
        operation,
        correctAnswer,
      );

      const taskId = await this.createTaskUseCase.execute(createTaskDto);
      if (!taskId) {
        logger.error('No se pudo crear la tarea');
        return res.status(500).json({
          success: false,
          message: 'No se ha logrado crear la tarea',
        });
      }

      logger.info(`Tarea creada con ID: ${taskId}`);

      return res.status(201).json({
        success: true,
        message: 'Tarea creada exitosamente',
        data: {
          taskId,
        },
      });
    } catch (error) {
      logger.error('Error en createTaskData:', error);
      next(error);
    }
  }

  async updateStatusTaskData(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const authHeader = req.headers.authorization;

      const token =
        authHeader && authHeader.startsWith('Bearer ')
          ? authHeader.substring(7)
          : null;

      if (!token) {
        return res.status(401);
      }

      const decoded = decodeToken(token);
      logger.info(decoded);

      if (!decoded?.parentId || !decoded?.childrenId || !decoded?.email) {
        return res
          .status(401)
          .json({ error: 'Error autenticando Token, faltan datos' });
      }

      logger.info('Validacion de token cumplida exitosamente');

      const { taskId, childAnswer } = req.body;

      const taskStatus = await this.updateStatusTaskUseCase.execute(
        taskId,
        childAnswer,
      );

      if (taskStatus) {
        res.status(200).json({ data: 'Estado de tarea actualizada con Exito' });
      } else {
        res
          .status(200)
          .json({ data: 'No se ha encontrado la tarea solicitada' });
      }
    } catch (error) {
      logger.error('Error en updateStatusTask:', error);
      next(error);
    }
  }

  async getTaskByKids(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const authHeader = req.headers.authorization;

      const token =
        authHeader && authHeader.startsWith('Bearer ')
          ? authHeader.substring(7)
          : null;

      if (!token) {
        return res.status(401);
      }

      const decoded = decodeToken(token);
      logger.info(decoded);

      if (!decoded?.parentId || !decoded?.childrenId || !decoded?.email) {
        return res
          .status(401)
          .json({ error: 'Error autenticando Token, faltan datos' });
      }

      logger.info('Validacion de token cumplida exitosamente');

      const tasks = await this.getTasksByKidUseCase.execute(decoded.childrenId);

      const getTaskListByKidResponse = new GetTaskListByKidResponse(
        tasks.pendingTasks,
        tasks.tasks,
      );

      return res.status(200).json({
        success: true,
        message: `Se encontraron ${tasks.tasks.length} tareas`,
        data: getTaskListByKidResponse,
      });
    } catch (error) {
      logger.error('Error en getTaskByKids:', error);
      next(error);
    }
  }

  async deleteTaskByKid(req: Request, res: Response, next: Function) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const authHeader = req.headers.authorization;

      const token =
        authHeader && authHeader.startsWith('Bearer ')
          ? authHeader.substring(7)
          : null;

      if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
      }

      const decoded = decodeToken(token);
      logger.info(decoded);

      if (!decoded?.parentId || !decoded?.childrenId || !decoded?.email) {
        return res
          .status(401)
          .json({ error: 'Error autenticando Token, faltan datos' });
      }

      logger.info('Validacion de token cumplida exitosamente');

      const taskDeleted = await this.deleteTaskByKidUseCase.execute(
        decoded.childrenId,
      );
      if (taskDeleted) {
        return res
          .status(200)
          .json({ message: 'Tareas eliminadas correctamente' });
      } else {
        logger.warn(
          `No se encontraron tareas para el hijo ID: ${decoded.childrenId}`,
        );
        return res.status(204).send(); // 204 No Content
      }
    } catch (error) {
      logger.error('Error en deleteTaskByKid:', error);
      next(error);
    }
  }
}
