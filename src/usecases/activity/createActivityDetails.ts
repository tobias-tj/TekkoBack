import { CreateActivityDetailsDto } from '../../domain/interfaces/dto/activity/CreateActivityDetailsDto';
import { ManageActivityRepo } from '../../domain/interfaces/repositories/ManageActivityRepo';

export class CreateActivityDetails {
  constructor(private manageActivity: ManageActivityRepo) {}

  async execute(activityDetails: CreateActivityDetailsDto) {
    return await this.manageActivity.createActivityDetails(activityDetails);
  }
}
