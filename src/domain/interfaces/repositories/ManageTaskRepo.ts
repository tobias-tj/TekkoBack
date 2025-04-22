import { CreateTaskDto } from '../dto/tasks/CreateTaskDto';

export interface ManageTaskRepo {
  createTask(task: CreateTaskDto): Promise<{ taskId: number | null }>;
}
