import { ManageActivityRepo } from '../../domain/interfaces/repositories/ManageActivityRepo';

export class UpdateActivityStatusById {
  constructor(private manageActivity: ManageActivityRepo) {}

  async execute(activityId: number) {
    return await this.manageActivity.updateActivityStatus(activityId);
  }
}
