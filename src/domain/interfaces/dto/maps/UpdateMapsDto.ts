import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class UpdateMaps {
  @IsNumber()
  id: number;

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

  constructor(
    id: number,
    typeMap: string,
    latitude: number,
    longitude: number,
  ) {
    this.id = id;
    this.typeMap = typeMap;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
