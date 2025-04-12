import { GetProfileDto } from '../dto/settings/GetProfileDto';
import { UpdateProfile } from '../dto/settings/UpdateProfileDto';

export interface ManageSettingsRepo {
  getDetailsProfile(
    parentId: number,
    childrenId: number,
  ): Promise<GetProfileDto>;
  updateProfileData(profileUpdateDto: UpdateProfile): Promise<boolean>;
}
