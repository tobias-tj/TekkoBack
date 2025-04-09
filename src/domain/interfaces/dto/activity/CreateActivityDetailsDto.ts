import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateActivityDetailsDto {
  @IsNotEmpty()
  start_activity_time: Date;

  @IsNotEmpty()
  expiration_activity_time: Date;

  @IsString()
  @IsNotEmpty()
  title_activity: string;

  @IsString()
  @IsNotEmpty()
  description_activity: string;

  @IsNumber()
  @IsNotEmpty()
  experience_activity: number;

  constructor(data: {
    start_activity_time: string | Date;
    expiration_activity_time: string | Date;
    title_activity: string;
    description_activity: string;
    experience_activity: number;
  }) {
    this.start_activity_time = new Date(data.start_activity_time);
    this.expiration_activity_time = new Date(data.expiration_activity_time);
    this.title_activity = data.title_activity;
    this.description_activity = data.description_activity;
    this.experience_activity = data.experience_activity;
  }
}
