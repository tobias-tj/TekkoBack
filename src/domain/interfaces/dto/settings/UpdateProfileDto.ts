import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateProfile {
  @IsNumber()
  @IsNotEmpty()
  parentId: number;

  @IsNumber()
  @IsNotEmpty()
  childrenId: number;

  @IsString()
  parentName: string;

  @IsString()
  childrenName: string;

  @IsNumber()
  age: number;

  constructor(
    parentId: number,
    childrenId: number,
    parentName: string,
    childrenName: string,
    age: number,
  ) {
    this.parentId = parentId;
    this.childrenId = childrenId;
    this.parentName = parentName;
    this.childrenName = childrenName;
    this.age = age;
  }
}
