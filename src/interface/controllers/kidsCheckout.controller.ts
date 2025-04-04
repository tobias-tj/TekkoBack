import { NextFunction, Request, Response } from 'express';
import { GetExperienceKid } from '../../usecases/kid_experience/getExperience';
import { logger } from '../../infrastructure/logger';
import { validationResult } from 'express-validator';

export class KidsCheckoutController {
  constructor(private getExperienceKid: GetExperienceKid) {}

  async getExperienceData(req: Request, res: Response, next: NextFunction) {
    try {
      const { childrenId } = req.query;

      if (!childrenId) {
        return res.status(400).json({
          success: false,
          message: 'El parámetro childrenId es requerido',
          errorCode: 'BAD_REQUEST',
        });
      }

      const experienceResult = await this.getExperienceKid.execute(
        Number(childrenId),
      );

      return res.status(200).json({
        success: true,
        message: 'Información de experiencia obtenida con éxito',
        data: experienceResult,
      });
    } catch (error) {
      logger.error('Error en getExperienceData:', error);

      res.status(500).json({
        success: false,
        message: 'Error al obtener la experiencia del niño',
        errorCode: 'INTERNAL_SERVER_ERROR',
      });
    }
  }
}
