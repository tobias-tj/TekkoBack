import { CreateTaskDto } from '../dto/tasks/CreateTaskDto';

export interface ManageTaskRepo {
  createTask(task: CreateTaskDto): Promise<{ taskId: number | null }>;
  updateStatusTask(taskId: number, childAnswer: number): Promise<boolean>;
}
