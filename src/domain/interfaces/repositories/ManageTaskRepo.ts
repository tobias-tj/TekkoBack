import { CreateTaskDto } from '../dto/tasks/CreateTaskDto';
import { GetTasksKidDto } from '../dto/tasks/GetTasksKidDto';

export interface ManageTaskRepo {
  createTask(task: CreateTaskDto): Promise<{ taskId: number | null }>;
  updateStatusTask(taskId: number, childAnswer: number): Promise<boolean>;
  getTasksByKid(
    childId: number,
  ): Promise<{ pendingTasks: number; tasks: GetTasksKidDto[] }>;
  deleteTasksByKid(childId: number): Promise<boolean>;
}
