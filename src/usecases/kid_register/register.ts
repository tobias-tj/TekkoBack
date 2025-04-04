import { CreateKidDto } from '../../domain/interfaces/dto/kids/CreateKidDto';
import { ManageKidRepo } from '../../domain/interfaces/repositories/ManageKidRepo';

export class RegisterKid {
  constructor(private manageKid: ManageKidRepo) {}

  async execute(createKidDto: CreateKidDto) {
    return await this.manageKid.register(createKidDto);
  }
}
