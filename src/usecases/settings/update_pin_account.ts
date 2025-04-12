import { UpdateProfile } from '../../domain/interfaces/dto/settings/UpdateProfileDto';
import { ManageSettingsRepo } from '../../domain/interfaces/repositories/ManageSettingsRepo';

export class UpdatePinAccountData {
  constructor(private manageRepository: ManageSettingsRepo) {}

  async execute(parentId: number, pinToken: string, oldToken: string) {
    return await this.manageRepository.updatePinAccount(
      parentId,
      pinToken,
      oldToken,
    );
  }
}
