import { body } from 'express-validator';

export const parentLoginValidation = [
  body('email')
    .notEmpty()
    .withMessage('El correo es obligatorio')
    .isEmail()
    .withMessage('Debe ser un email valido'),
  body('password').notEmpty().withMessage('El password es obligatorio'),
];
