import { CreateParentDto } from '../../domain/interfaces/dto/parent/CreateParentDto';
import { ManageParentRepo } from '../../domain/interfaces/repositories/ManageParentRepo';

export class RegisterParent {
  constructor(private manageParent: ManageParentRepo) {}

  async execute(createParentDto: CreateParentDto) {
    return await this.manageParent.register(createParentDto);
  }
}
