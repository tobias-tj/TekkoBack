import { CreateTaskDto } from '../../../domain/interfaces/dto/tasks/CreateTaskDto';
import { ManageTaskRepo } from '../../../domain/interfaces/repositories/ManageTaskRepo';
import { pool } from '../../database/dbConnection';
import { logger } from '../../logger';

export class ManageTaskRepository implements ManageTaskRepo {
  async createTask(task: CreateTaskDto): Promise<{ taskId: number | null }> {
    try {
      const taskQuery = `
                INSERT INTO tareas (
                    parent_id,
                    child_id,
                    number1,
                    number2,
                    operation,
                    correct_answer
                ) VALUES($1, $2, $3, $4, $5, $6)
                 RETURNING task_id
            `;

      const values = [
        task.parentId,
        task.childrenId,
        task.number1,
        task.number2,
        task.operation,
        task.correctAnswer,
      ];

      const result = await pool.query(taskQuery, values);

      if (result.rows.length === 0) {
        throw new Error('No se pudo insertar la tarea');
      }

      return { taskId: result.rows[0].task_id };
    } catch (error) {
      logger.error('Error en TaskRepository.createTask: ', error);
      throw error;
    }
  }

  async updateStatusTask(
    taskId: number,
    childAnswer: number,
  ): Promise<boolean> {
    try {
      logger.info(
        `Inicia proceso para actualizar estado de la tarea con ID: ${taskId}`,
      );

      const queryUpdateTask = `
            UPDATE tareas
            SET
                is_completed = TRUE,
                child_answer = $1
            WHERE task_id = $2
            RETURNING *;
        `;

      const result = await pool.query(queryUpdateTask, [childAnswer, taskId]);

      if (result.rows.length === 0) {
        logger.warn(`No se encontró ninguna tarea con ID: ${taskId}`);
        return false;
      }

      logger.info(`Tarea con ID: ${taskId} actualizada con éxito`);
      return true;
    } catch (error) {
      logger.error('Error en TaskRepository.updateStatusTask:', { error });
      throw new Error('Error actualizando la tarea en la base de datos');
    }
  }
}
