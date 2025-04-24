import { query } from 'express-validator';

export const getTaskByKidsValidation = [
  query('childId')
    .notEmpty()
    .withMessage('El Child ID es obligatorio')
    .isInt({ min: 1 })
    .withMessage('Debe ser un entero positivo')
    .toInt(),
];
