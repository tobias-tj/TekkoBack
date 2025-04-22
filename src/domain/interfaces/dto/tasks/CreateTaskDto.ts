import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsNumber()
  @IsNotEmpty()
  parentId: number;

  @IsNumber()
  @IsNotEmpty()
  childrenId: number;

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

  constructor(
    parentId: number,
    childrenId: number,
    number1: number,
    number2: number,
    operation: string,
    correctAnswer: number,
  ) {
    this.parentId = parentId;
    this.childrenId = childrenId;
    this.number1 = number1;
    this.number2 = number2;
    this.operation = operation;
    this.correctAnswer = correctAnswer;
  }
}
