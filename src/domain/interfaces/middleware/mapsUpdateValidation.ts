import { body, header } from 'express-validator';

export const mapsUpdateValidation = [
  body('typeMap')
    .notEmpty()
    .withMessage('El tipo de mapa es obligatorio.')
    .isString()
    .withMessage('El tipo de mapa debe ser un texto.'),
  body('latitude')
    .notEmpty()
    .withMessage('La latitud es obligatoria.')
    .isNumeric()
    .withMessage('La latitud debe ser un número.'),
  body('longitude')
    .notEmpty()
    .withMessage('La longitud es obligatoria.')
    .isNumeric()
    .withMessage('La longitud debe ser un número.'),
  header('authorization')
    .notEmpty()
    .withMessage('El token de autorización es obligatorio.'),
];
