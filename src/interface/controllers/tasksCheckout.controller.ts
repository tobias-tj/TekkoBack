import { validationResult } from 'express-validator';
import { CreateTasks } from '../../usecases/tasks/create_tasks';
import { NextFunction, Request, Response } from 'express';
import { CreateTaskDto } from '../../domain/interfaces/dto/tasks/CreateTaskDto';
import { logger } from '../../infrastructure/logger';

export class TasksCheckoutController {
  constructor(private createTaskUseCase: CreateTasks) {}

  async createTaskData(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        parentId,
        childrenId,
        number1,
        number2,
        operation,
        correctAnswer,
      } = req.body;

      const createTaskDto = new CreateTaskDto(
        parentId,
        childrenId,
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
}
