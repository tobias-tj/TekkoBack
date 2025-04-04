import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateKidDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  age: number;

  @IsNumber()
  @IsNotEmpty()
  parentId: number;

  constructor(name: string, age: number, parentId: number) {
    this.name = name;
    this.age = age;
    this.parentId = parentId;
  }
}
