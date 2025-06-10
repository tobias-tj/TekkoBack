import { GetMapsInformationDto } from '../dto/maps/GetMapInformationDto';
import { MapInformationDto } from '../dto/maps/MapInformationDto';
import { UpdateMaps } from '../dto/maps/UpdateMapsDto';

export interface ManageMapsRepo {
  createMapsInformation(
    createMapList: MapInformationDto[],
    parent_id: number,
  ): Promise<boolean>;
  getMapsInformation(parent_id: number): Promise<GetMapsInformationDto[]>;
  updateMapsInformation(updateMapInformation: UpdateMaps): Promise<boolean>;
}
