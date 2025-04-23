import { IsNotEmpty, IsNumber } from 'class-validator';
import { GetTasksKidDto } from './GetTasksKidDto';

export class GetTaskListByKidResponse {
  @IsNumber()
  pendingTasks: number;

  @IsNotEmpty()
  tasks: GetTasksKidDto[];

  constructor(pendingTasks: number, tasks: GetTasksKidDto[]) {
    this.pendingTasks = pendingTasks;
    this.tasks = tasks;
  }
}
