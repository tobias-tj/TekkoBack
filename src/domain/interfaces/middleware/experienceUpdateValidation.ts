import { body, header } from 'express-validator';
export const experienceUpdateValidation = [
  header('authorization')
    .notEmpty()
    .withMessage('El token de autorización es obligatorio.'),
  body('points')
    .isInt({ min: 0 })
    .withMessage('Los puntos deben ser un número entero mayor o igual a 0.'),
];
