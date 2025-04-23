import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetTasksKidDto {
  @IsNumber()
  @IsNotEmpty()
  taskId: number;

  @IsNumber()
  @IsNotEmpty()
  number1: number;

  @IsNumber()
  @IsNotEmpty()
  number2: number;

  @IsString()
  @IsNotEmpty()
  operation: string;

  @IsNumber()
  @IsNotEmpty()
  correctAnswer: number;

  @IsBoolean()
  @IsNotEmpty()
  isCompleted: boolean;

  @IsNumber()
  @IsNotEmpty()
  childAnswer: number;

  @IsNumber()
  @IsNotEmpty()
  pendingTasks: number;

  constructor(
    taskId: number,
    number1: number,
    number2: number,
    operation: string,
    correctAnswer: number,
    isCompleted: boolean,
    childAnswer: number,
    pendingTasks: number,
  ) {
    this.taskId = taskId;
    this.number1 = number1;
    this.number2 = number2;
    this.operation = operation;
    this.correctAnswer = correctAnswer;
    this.isCompleted = isCompleted;
    this.childAnswer = childAnswer;
    this.pendingTasks = pendingTasks;
  }
}
