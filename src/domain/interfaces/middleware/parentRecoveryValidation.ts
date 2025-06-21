import { body } from 'express-validator';

export const ParentRecoveryValidation = [
  body('emailAccount')
    .notEmpty()
    .withMessage('El correo es obligatorio')
    .isEmail()
    .withMessage('Debe ser un email valido'),
];
