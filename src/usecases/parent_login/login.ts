import { ManageParentRepo } from '../../domain/interfaces/repositories/ManageParentRepo';

export class LoginParent {
  constructor(private manageParent: ManageParentRepo) {}

  async execute(email: string, password: string) {
    return await this.manageParent.login(email, password);
  }
}
