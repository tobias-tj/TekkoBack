import { body } from 'express-validator';

export const authGoogleValidation = [
  body('idToken')
    .notEmpty()
    .withMessage('El nombre de los padres son obligatorios.')
    .isString()
    .withMessage('El nombre de los padres deben de ser un texto'),
];
