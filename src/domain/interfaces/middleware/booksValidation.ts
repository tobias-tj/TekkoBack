import { header, query } from 'express-validator';

export const booksValidation = [
  header('authorization')
    .notEmpty()
    .withMessage('El token de autorización es obligatorio.'),
];
