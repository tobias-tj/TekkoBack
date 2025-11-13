import { CreateKidDto } from '../dto/kids/CreateKidDto';
import { ExperienceDto } from '../dto/kids/ExperienceDto';

export interface ManageKidRepo {
  register(createKidDto: CreateKidDto): Promise<number | null>;
  getExperience(childrenId: number): Promise<ExperienceDto>;
  updateExperience(childrenId: number, points: number): Promise<boolean>;
}
