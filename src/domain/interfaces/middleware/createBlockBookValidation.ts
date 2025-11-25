import { header, body } from 'express-validator';

export const blockBookValidator = [
  header('authorization')
    .notEmpty()
    .withMessage('El token de autorización es obligatorio.'),

  body('bookId')
    .notEmpty()
    .isInt({ min: 1 })
    .withMessage('El Book id debe ser un número entero válido.'),
];
