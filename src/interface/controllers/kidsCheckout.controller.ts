import { NextFunction, Request, Response } from 'express';
import { GetExperienceKid } from '../../usecases/kid_experience/getExperience';
import { logger } from '../../infrastructure/logger';
import { decodeToken } from '../../domain/interfaces/middleware/jwtMiddleware';
import { UpdateExperienceKid } from '../../usecases/kid_experience/updateExperience';

export class KidsCheckoutController {
  constructor(
    private getExperienceKid: GetExperienceKid,
    private updateExperienceKid: UpdateExperienceKid,
  ) {}

  async getExperienceData(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;

      const token =
        authHeader && authHeader.startsWith('Bearer ')
          ? authHeader.substring(7)
          : null;

      if (!token) {
        return res.status(401);
      }

      const decoded = decodeToken(token);
      logger.info(decoded);

      if (!decoded?.parentId || !decoded?.childrenId || !decoded?.email) {
        return res
          .status(401)
          .json({ error: 'Error autenticando Token, faltan datos' });
      }

      const experienceResult = await this.getExperienceKid.execute(
        Number(decoded.childrenId),
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

  async updateExperienceData(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;

      const token =
        authHeader && authHeader.startsWith('Bearer ')
          ? authHeader.substring(7)
          : null;

      if (!token) {
        return res.status(401);
      }

      const decoded = decodeToken(token);
      logger.info(decoded);

      if (!decoded?.parentId || !decoded?.childrenId || !decoded?.email) {
        return res
          .status(401)
          .json({ error: 'Error autenticando Token, faltan datos' });
      }

      const { points } = req.body;

      const updateResult = await this.updateExperienceKid.execute(
        Number(decoded.childrenId),
        points,
      );

      if (!updateResult) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo actualizar la experiencia del niño',
          errorCode: 'UPDATE_FAILED',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Experiencia del niño actualizada con éxito',
      });
    } catch (error) {
      logger.error('Error en updateExperienceData:', error);
      next(error);
    }
  }
}
