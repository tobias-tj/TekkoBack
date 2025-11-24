import { header, param } from 'express-validator';

export const getBookPdfValidator = [
  header('authorization')
    .notEmpty()
    .withMessage('El token de autorización es obligatorio.'),

  param('id')
    .notEmpty()
    .withMessage('El parámetro "id" es obligatorio.')
    .isInt({ min: 1 })
    .withMessage('El parámetro "id" debe ser un número mayor a 0.'),
];
