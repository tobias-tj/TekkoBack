import { ManageParentRepo } from '../../domain/interfaces/repositories/ManageParentRepo';

export class LoginParent {
  constructor(private manageParent: ManageParentRepo) {}

  async execute(email: string, password: string) {
    return await this.manageParent.login(email, password);
  }
  async executeLoginGoogle(email: string) {
    return await this.manageParent.loginGoogle(email);
  }

  async executeLoginAdmin(email: string, password: string) {
    return await this.manageParent.loginAdmin(email, password);
  }
}
