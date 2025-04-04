import { CreateKidDto } from '../dto/kids/CreateKidDto';

export interface ManageKidRepo {
  register(createKidDto: CreateKidDto): Promise<number | null>;
}
