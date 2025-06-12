import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class MapInformationDto {
  @IsString()
  @IsNotEmpty()
  typeMap: string;

  @IsNumber()
  @Min(-90) // Latitud mínima (Antártida)
  @Max(90) // Latitud máxima (Polo Norte)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  constructor(typeMap: string, latitude: number, longitude: number) {
    this.typeMap = typeMap;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
