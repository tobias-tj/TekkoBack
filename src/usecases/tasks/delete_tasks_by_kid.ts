import { ManageTaskRepo } from '../../domain/interfaces/repositories/ManageTaskRepo';

export class DeleteTasksByKid {
  constructor(private manageTask: ManageTaskRepo) {}

  async execute(childId: number) {
    return await this.manageTask.deleteTasksByKid(childId);
  }
}
