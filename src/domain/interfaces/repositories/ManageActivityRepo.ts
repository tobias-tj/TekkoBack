import { CreateActivityDetailsDto } from '../dto/activity/CreateActivityDetailsDto';
import { CreateActivityDto } from '../dto/activity/CreateActivityDto';
import { GetActivityDto } from '../dto/activity/GetActivityDto';

export interface ManageActivityRepo {
  createActivityDetails(
    activityDetails: CreateActivityDetailsDto,
  ): Promise<{ activityDetailId: number | null; error?: string }>;
  createActivity(
    activity: CreateActivityDto,
  ): Promise<{ activityId: number | null }>;
  getActivity(
    dateFilter: string,
    parentId: number,
    statusFilter: string | null,
  ): Promise<GetActivityDto[]>;
}
