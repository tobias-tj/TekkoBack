import { body } from 'express-validator';

export const createTaskValidation = [
  body('parentId')
    .notEmpty()
    .withMessage('El Parent ID es obligatorio')
    .isInt({ min: 1 })
    .withMessage('Debe ser un entero positivo')
    .toInt(),
  body('childrenId')
    .notEmpty()
    .withMessage('El Children ID es obligatorio')
    .isInt({ min: 1 })
    .withMessage('Debe ser un entero positivo')
    .toInt(),
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
