import { CreateParentDto } from '../../domain/interfaces/dto/parent/CreateParentDto';
import { ManageParentRepo } from '../../domain/interfaces/repositories/ManageParentRepo';

export class LoginParent {
  constructor(private manageParent: ManageParentRepo) {}

  async execute(email: string, password: string) {
    return await this.manageParent.login(email, password);
  }
}
