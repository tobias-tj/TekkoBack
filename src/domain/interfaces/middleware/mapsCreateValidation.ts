import { body, header } from 'express-validator';

export const mapsCreateValidation = [
  body('maps')
    .isArray({ min: 1 })
    .withMessage('Debe proporcionar al menos un mapa.'),
  body('maps.*.typeMap')
    .notEmpty()
    .withMessage('El tipo de mapa es obligatorio.')
    .isString()
    .withMessage('El tipo de mapa debe ser un texto.'),
  body('maps.*.latitude')
    .notEmpty()
    .withMessage('La latitud es obligatoria.')
    .isNumeric()
    .withMessage('La latitud debe ser un número.'),
  body('maps.*.longitude')
    .notEmpty()
    .withMessage('La longitud es obligatoria.')
    .isNumeric()
    .withMessage('La longitud debe ser un número.'),
  header('authorization')
    .notEmpty()
    .withMessage('El token de autorización es obligatorio.'),
];
