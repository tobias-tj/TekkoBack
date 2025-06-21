import { header } from 'express-validator';

export const senderPinValidation = [
  header('authorization')
    .notEmpty()
    .withMessage('El token de autorización es obligatorio.'),
];
