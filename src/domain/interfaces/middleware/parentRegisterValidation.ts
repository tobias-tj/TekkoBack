import { body } from 'express-validator';

export const parentRegisterValidation = [
  body('fullNameParent')
    .notEmpty()
    .withMessage('El nombre de los padres son obligatorios.')
    .isString()
    .withMessage('El nombre de los padres deben de ser un texto'),
  body('email')
    .notEmpty()
    .withMessage('El correo es obligatorio')
    .isEmail()
    .withMessage('Debe ser un email valido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('nameKid')
    .notEmpty()
    .withMessage('El nombre de los hijos son obligatorios.')
    .isString()
    .withMessage('El nombre de los hijos deben de ser un texto'),
  body('ageKid')
    .notEmpty()
    .withMessage('La edad de los hijos son obligatorios.')
    .isNumeric()
    .withMessage('La edad debe de ser un numero'),
];
