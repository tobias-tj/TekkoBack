import { ManageActivityRepo } from '../../domain/interfaces/repositories/ManageActivityRepo';

export class GetActivity {
  constructor(private manageActivity: ManageActivityRepo) {}

  async execute(
    dateFilter: string,
    parentId: number,
    statusFilter: string | null,
  ) {
    return await this.manageActivity.getActivity(
      dateFilter,
      parentId,
      statusFilter,
    );
  }
}
