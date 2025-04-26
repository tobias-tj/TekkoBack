import { body } from 'express-validator';

export const createTaskValidation = [
  body('number1').notEmpty().withMessage('El dato 1 es obligatorio').toInt(),
  body('number2').notEmpty().withMessage('El dato 2 es obligatorio').toInt(),
  body('operation')
    .notEmpty()
    .withMessage('El tipo de operacion es obligatorio'),
  body('correctAnswer')
    .notEmpty()
    .withMessage('La respuesta correcta es obligatorio')
    .toInt(),
];
