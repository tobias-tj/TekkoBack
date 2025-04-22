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
}
