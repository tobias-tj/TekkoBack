import { ManageKidRepo } from '../../domain/interfaces/repositories/ManageKidRepo';

export class GetExperienceKid {
  constructor(private manageKid: ManageKidRepo) {}

  async execute(childrenId: number) {
    return await this.manageKid.getExperience(childrenId);
  }
}
