import { ManageParentRepo } from '../../domain/interfaces/repositories/ManageParentRepo';

export class PinSecurity {
  constructor(private manageParent: ManageParentRepo) {}

  async execute(pinSecurity: string, parentId: number) {
    return await this.manageParent.securityPin(pinSecurity, parentId);
  }
}
