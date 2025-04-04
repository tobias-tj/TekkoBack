import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateParentDto {
  @IsNumber()
  @IsNotEmpty()
  pinParent: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  constructor(
    pinParent: string,
    email: string,
    password: string,
    fullName: string,
  ) {
    this.pinParent = pinParent;
    this.email = email;
    this.password = password;
    this.fullName = fullName;
  }
}
