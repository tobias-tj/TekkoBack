import { body } from 'express-validator';

export const activityDetailsValidation = [
  body('detail')
    .notEmpty()
    .withMessage('El detalle de la actividad es obligatorio.')
    .isObject()
    .withMessage('El detalle debe ser un objeto'),

  body('detail.start_activity_time')
    .notEmpty()
    .withMessage('El tiempo de inicio de la actividad es obligatorio.')
    .isISO8601()
    .withMessage(
      'El tiempo de inicio debe ser una fecha válida en formato ISO 8601',
    ),

  body('detail.expiration_activity_time')
    .notEmpty()
    .withMessage('El tiempo de expiración de la actividad es obligatorio.')
    .isISO8601()
    .withMessage(
      'El tiempo de expiración debe ser una fecha válida en formato ISO 8601',
    ),

  body('detail.title_activity')
    .notEmpty()
    .withMessage('El título de la actividad es obligatorio.')
    .isString()
    .withMessage('El título de la actividad debe ser un texto'),

  body('detail.description_activity')
    .notEmpty()
    .withMessage('La descripción de la actividad es obligatoria.')
    .isString()
    .withMessage('La descripción de la actividad debe ser un texto'),

  body('detail.experience_activity')
    .notEmpty()
    .withMessage('La experiencia de la actividad es obligatoria.')
    .isString()
    .withMessage('La experiencia de la actividad debe ser un texto'),

  body('children_id')
    .notEmpty()
    .withMessage('El ID del hijo es obligatorio.')
    .isInt()
    .withMessage('El ID del hijo debe ser un número entero'),

  body('parent_id')
    .notEmpty()
    .withMessage('El ID del padre es obligatorio.')
    .isInt()
    .withMessage('El ID del padre debe ser un número entero'),
];
