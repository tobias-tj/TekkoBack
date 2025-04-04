import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ExperienceDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsNumber()
  @IsNotEmpty()
  exp: number;

  @IsNumber()
  @IsNotEmpty()
  level: number;

  @IsNumber()
  @IsNotEmpty()
  expNextLevel: number;

  @IsNumber()
  @IsNotEmpty()
  nextLevel: number;

  constructor(
    fullName: string,
    exp: number,
    level: number,
    expNextLevel: number,
    nextLevel: number,
  ) {
    this.fullName = fullName;
    this.exp = exp;
    this.level = level;
    this.expNextLevel = expNextLevel;
    this.nextLevel = nextLevel;
  }
}
