import { ManageParentRepo } from '../../domain/interfaces/repositories/ManageParentRepo';

export class ParentIsAdmin {
  constructor(private manageParent: ManageParentRepo) {}

  async execute(parentId: number) {
    return await this.manageParent.isParentAdmin(parentId);
  }
}
