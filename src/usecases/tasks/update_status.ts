import { ManageTaskRepo } from '../../domain/interfaces/repositories/ManageTaskRepo';

export class UpdateStatus {
  constructor(private manageTask: ManageTaskRepo) {}

  async execute(taskId: number, childAnswer: number) {
    return await this.manageTask.updateStatusTask(taskId, childAnswer);
  }
}
