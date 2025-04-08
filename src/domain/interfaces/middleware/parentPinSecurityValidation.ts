import { body } from 'express-validator';

export const ParentPinSecurityValidation = [
  body('pinSecurity').notEmpty().isString(),
  body('parentId').notEmpty().isInt(),
];
