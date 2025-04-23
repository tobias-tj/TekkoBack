import { body } from 'express-validator';

export const updateStatusTaskValidation = [
  body('taskId')
    .notEmpty()
    .withMessage('El Task ID es obligatorio')
    .isInt({ min: 1 })
    .withMessage('Debe ser un entero positivo')
    .toInt(),
  body('childAnswer')
    .notEmpty()
    .withMessage('La respuesta de la tarea es obligatoria')
    .toInt(),
];
