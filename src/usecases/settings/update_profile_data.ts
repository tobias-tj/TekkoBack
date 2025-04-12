import { UpdateProfile } from '../../domain/interfaces/dto/settings/UpdateProfileDto';
import { ManageSettingsRepo } from '../../domain/interfaces/repositories/ManageSettingsRepo';

export class UpdateProfileData {
  constructor(private manageRepository: ManageSettingsRepo) {}

  async execute(profileUpdateDto: UpdateProfile) {
    return await this.manageRepository.updateProfileData(profileUpdateDto);
  }
}
