import { ManageActivityRepo } from '../../domain/interfaces/repositories/ManageActivityRepo';

export class GetActivityByKids {
  constructor(private manageActivity: ManageActivityRepo) {}

  async execute(dateFilter: string, kidId: number) {
    return await this.manageActivity.getActivityKids(dateFilter, kidId);
  }
}
