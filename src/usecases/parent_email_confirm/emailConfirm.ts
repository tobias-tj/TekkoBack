import { ManageParentRepo } from '../../domain/interfaces/repositories/ManageParentRepo';

export class EmailConfirm {
  constructor(private manageParent: ManageParentRepo) {}

  async execute(email: string) {
    return await this.manageParent.validEmail(email);
  }
}
