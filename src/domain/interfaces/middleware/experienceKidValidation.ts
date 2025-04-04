import { body } from 'express-validator';

export const experienceKidValidation = [
  body('childrenId')
    .notEmpty()
    .withMessage('El ID es obligatorio')
    .isInt({ min: 1 })
    .withMessage('Debe ser un entero positivo')
    .toInt(),
];
