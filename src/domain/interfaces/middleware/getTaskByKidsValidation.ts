import { body } from 'express-validator';

export const getTaskByKidsValidation = [
  body('childId')
    .notEmpty()
    .withMessage('El Child ID es obligatorio')
    .isInt({ min: 1 })
    .withMessage('Debe ser un entero positivo')
    .toInt(),
];
