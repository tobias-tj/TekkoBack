import { body, header } from 'express-validator';

export const mapsGetValidation = [
  header('authorization')
    .notEmpty()
    .withMessage('El token de autorización es obligatorio.'),
];
