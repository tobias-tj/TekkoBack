import { CreateTaskDto } from '../../domain/interfaces/dto/tasks/CreateTaskDto';
import { ManageTaskRepo } from '../../domain/interfaces/repositories/ManageTaskRepo';

export class CreateTasks {
  constructor(private manageTask: ManageTaskRepo) {}

  async execute(task: CreateTaskDto) {
    const result = await this.manageTask.createTask(task);
    return result.taskId;
  }
}
