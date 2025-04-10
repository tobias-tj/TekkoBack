import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetActivityDto {
  @IsNumber()
  @IsNotEmpty()
  activity_detail_id: number;

  @IsNotEmpty()
  start_activity_time: Date;

  @IsNotEmpty()
  expiration_activity_time: Date;

  @IsString()
  @IsNotEmpty()
  title_activity: string;

  @IsString()
  description_activity?: string;

  @IsNumber()
  @IsNotEmpty()
  experience_activity: number;

  @IsNumber()
  @IsNotEmpty()
  activity_id: number;

  @IsNumber()
  @IsNotEmpty()
  children_id: number;

  @IsNumber()
  @IsNotEmpty()
  parent_id: number;

  @IsString()
  @IsNotEmpty()
  status: string;

  constructor(
    activity_detail_id: number,
    start_activity_time: string | Date,
    expiration_activity_time: string | Date,
    title_activity: string,
    description_activity: string,
    experience_activity: number,
    activity_id: number,
    children_id: number,
    parent_id: number,
    status: string,
  ) {
    this.activity_detail_id = activity_detail_id;
    this.start_activity_time = new Date(start_activity_time);
    this.expiration_activity_time = new Date(expiration_activity_time);
    this.title_activity = title_activity;
    this.description_activity = description_activity;
    this.experience_activity = experience_activity;
    this.activity_id = activity_id;
    this.children_id = children_id;
    this.parent_id = parent_id;
    this.status = status;
  }
}
