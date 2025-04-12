import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { logger } from '../../infrastructure/logger';
import { GetDetailsProfile } from '../../usecases/settings/get_details_profile';
import { UpdateProfile } from '../../domain/interfaces/dto/settings/UpdateProfileDto';
import { UpdateProfileData } from '../../usecases/settings/update_profile_data';

export class SettingsCheckoutController {
  constructor(
    private getProfileDetails: GetDetailsProfile,
    private updateProfileData: UpdateProfileData,
  ) {}

  async getDetailsProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { children_id, parent_id } = req.query;

      logger.info(
        `Obteniendo detalles del perfil: ${children_id} y parent_id: ${parent_id}`,
      );

      const detailProfile = await this.getProfileDetails.execute(
        Number(parent_id),
        Number(children_id),
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
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { parentId, childrenId, nameParent, nameChildren, age } = req.body;

      logger.info(
        `Inicio de actualizando de perfil para Padre con ID: ${parentId}`,
      );

      const profileUpdateDto = new UpdateProfile(
        parentId,
        childrenId,
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
}
