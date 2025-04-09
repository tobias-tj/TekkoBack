import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateActivityDto {
  @IsNumber()
  @IsNotEmpty()
  activity_detail_id: number;

  @IsNumber()
  @IsNotEmpty()
  children_id: number;

  @IsNumber()
  @IsNotEmpty()
  parent_id: number;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  status_ref?: string | null;

  constructor(
    activity_detail_id: number,
    children_id: number,
    parent_id: number,
    status: string = 'PENDING',
    status_ref: string | null = null,
  ) {
    this.activity_detail_id = activity_detail_id;
    this.children_id = children_id;
    this.parent_id = parent_id;
    this.status = status;
    this.status_ref = status_ref;
  }
}
