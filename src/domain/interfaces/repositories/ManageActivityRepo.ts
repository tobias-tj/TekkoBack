import { CreateActivityDetailsDto } from '../dto/activity/CreateActivityDetailsDto';
import { CreateActivityDto } from '../dto/activity/CreateActivityDto';

export interface ManageActivityRepo {
  createActivityDetails(
    activityDetails: CreateActivityDetailsDto,
  ): Promise<{ activityDetailId: number | null; error?: string }>;
  createActivity(
    activity: CreateActivityDto,
  ): Promise<{ activityId: number | null }>;
}
