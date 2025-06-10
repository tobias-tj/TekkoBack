import { ArrayMinSize, IsArray } from 'class-validator';
import { MapInformationDto } from './MapInformationDto';

export class CreateMapsListDto {
  @IsArray()
  @ArrayMinSize(1)
  maps: MapInformationDto[] = [];
}
