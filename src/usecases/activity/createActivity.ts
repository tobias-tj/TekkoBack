import { ActivityDetails } from '../../domain/entities/ActivityDetails';
import { CreateActivityDto } from '../../domain/interfaces/dto/activity/CreateActivityDto';
import { ManageActivityRepo } from '../../domain/interfaces/repositories/ManageActivityRepo';

export class CreateActivity {
  constructor(private manageActivity: ManageActivityRepo) {}

  async execute(activity: CreateActivityDto) {
    const result = await this.manageActivity.createActivity(activity);
    return result.activityId;
  }
}
