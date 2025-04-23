import { ManageTaskRepo } from '../../domain/interfaces/repositories/ManageTaskRepo';

export class GetTasksByKid {
  constructor(private manageTask: ManageTaskRepo) {}

  async execute(childId: number) {
    return await this.manageTask.getTasksByKid(childId);
  }
}
