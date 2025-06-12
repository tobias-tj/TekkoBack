import { CreateMapsListDto } from '../../domain/interfaces/dto/maps/CreateMapsListDto';
import { MapInformationDto } from '../../domain/interfaces/dto/maps/MapInformationDto';
import { ManageMapsRepo } from '../../domain/interfaces/repositories/ManageMapsRepo';

export class CreateMapsInformation {
  constructor(private manageMaps: ManageMapsRepo) {}

  async execute(createMapList: CreateMapsListDto, parent_id: number) {
    return await this.manageMaps.createMapsInformation(
      createMapList.maps,
      parent_id,
    );
  }
}
