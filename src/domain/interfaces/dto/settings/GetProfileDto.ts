import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetProfileDto {
  @IsString()
  @IsNotEmpty()
  parent_name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  childName: string;

  @IsNumber()
  @IsNotEmpty()
  age: number;

  @IsNumber()
  @IsNotEmpty()
  total_activities_created_by_parent: number;

  @IsNumber()
  @IsNotEmpty()
  total_completed_activities_by_child: number;

  constructor(
    parent_name: string,
    email: string,
    childName: string,
    age: number,
    total_activities_created_by_parent: number,
    total_completed_activities_by_child: number,
  ) {
    this.parent_name = parent_name;
    this.email = email;
    this.childName = childName;
    this.age = age;
    this.total_activities_created_by_parent =
      total_activities_created_by_parent;
    this.total_completed_activities_by_child =
      total_completed_activities_by_child;
  }
}
