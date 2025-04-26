import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { logger } from '../../infrastructure/logger';
import { GetDetailsProfile } from '../../usecases/settings/get_details_profile';
import { UpdateProfile } from '../../domain/interfaces/dto/settings/UpdateProfileDto';
import { UpdateProfileData } from '../../usecases/settings/update_profile_data';
import { UpdatePinAccountData } from '../../usecases/settings/update_pin_account';
import { decodeToken } from '../../domain/interfaces/middleware/jwtMiddleware';

export class SettingsCheckoutController {
  constructor(
    private getProfileDetails: GetDetailsProfile,
    private updateProfileData: UpdateProfileData,
    private updatePinAccountData: UpdatePinAccountData,
  ) {}

  async getDetailsProfile(req: Request, res: Response, next: NextFunction) {
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

      logger.info(
        `Obteniendo detalles del perfil: ${decoded.childrenId} y parent_id: ${decoded.parentId}`,
      );

      const detailProfile = await this.getProfileDetails.execute(
        Number(decoded.parentId),
        Number(decoded.childrenId),
      );

      logger.info(detailProfile);

      return res.status(200).json({
        success: true,
        message: `Se encontraron correctamente informacion del perfil`,
        data: detailProfile,
      });
    } catch (error) {
      logger.error('Error en getDetailsProfile:', error);
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { nameParent, nameChildren, age } = req.body;
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

      logger.info(
        `Inicio de actualizando de perfil para Padre con ID: ${decoded.parentId}`,
      );

      const profileUpdateDto = new UpdateProfile(
        Number(decoded.parentId),
        decoded.childrenId,
        nameParent,
        nameChildren,
        age,
      );

      const isUpdateSuccess =
        await this.updateProfileData.execute(profileUpdateDto);

      if (isUpdateSuccess) {
        res
          .status(200)
          .json({ success: true, data: 'Perfil actualizado con Exito' });
      } else {
        res
          .status(200)
          .json({ data: 'No se ha encontrado el perfil solicitado' });
      }
    } catch (error) {
      logger.error('Error actualizando el perfil', { error });
      next(error);
    }
  }

  async updatePinAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { pinToken, oldToken } = req.body;

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

      logger.info(
        `Inicio de actualizando de PIN para Padre con ID: ${decoded.parentId}`,
      );

      const isUpdateSuccess = await this.updatePinAccountData.execute(
        Number(decoded.parentId),
        pinToken,
        oldToken,
      );

      if (isUpdateSuccess) {
        res
          .status(200)
          .json({ success: true, data: 'Pin actualizado con Exito' });
      } else {
        res.status(403).json({ data: 'Pin no es valido' });
      }
    } catch (error) {
      logger.error('Error actualizando el pin de los padres', { error });
      next(error);
    }
  }
}
