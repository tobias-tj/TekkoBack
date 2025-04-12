import { ManageSettingsRepo } from '../../domain/interfaces/repositories/ManageSettingsRepo';

export class GetDetailsProfile {
  constructor(private manageSettings: ManageSettingsRepo) {}

  async execute(parentId: number, childrenId: number) {
    return await this.manageSettings.getDetailsProfile(parentId, childrenId);
  }
}
