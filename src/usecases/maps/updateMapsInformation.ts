import { MapInformationDto } from '../../domain/interfaces/dto/maps/MapInformationDto';
import { UpdateMaps } from '../../domain/interfaces/dto/maps/UpdateMapsDto';
import { ManageMapsRepo } from '../../domain/interfaces/repositories/ManageMapsRepo';

export class UpdateMapsInformation {
  constructor(private manageMaps: ManageMapsRepo) {}

  async execute(updateMapInformation: UpdateMaps) {
    return await this.manageMaps.updateMapsInformation(updateMapInformation);
  }
}
