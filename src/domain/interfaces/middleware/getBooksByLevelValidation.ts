import { header, query } from 'express-validator';

export const getBooksByLevelValidator = [
  header('authorization')
    .notEmpty()
    .withMessage('El token de autorización es obligatorio.'),

  query('level')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El nivel debe ser un número entero válido.'),

  query('page').optional().isInt({ min: 1 }).withMessage('page debe ser >= 1'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('limit debe estar entre 1 y 50'),
];
