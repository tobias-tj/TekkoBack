import { ManageKidRepo } from '../../domain/interfaces/repositories/ManageKidRepo';

export class UpdateExperienceKid {
  constructor(private manageKid: ManageKidRepo) {}

  async execute(childrenId: number, points: number) {
    return await this.manageKid.updateExperience(childrenId, points);
  }
}
