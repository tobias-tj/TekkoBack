import { NextFunction, Request, Response } from 'express';
import { decodeToken } from '../../domain/interfaces/middleware/jwtMiddleware';
import { logger } from '../../infrastructure/logger';
import { CreateMapsInformation } from '../../usecases/maps/createMapsInformation';
import { validationResult } from 'express-validator';
import { CreateMapsListDto } from '../../domain/interfaces/dto/maps/CreateMapsListDto';
import { GetMapsInformation } from '../../usecases/maps/getMapsInformation';
import { UpdateMapsInformation } from '../../usecases/maps/updateMapsInformation';
import { UpdateMaps } from '../../domain/interfaces/dto/maps/UpdateMapsDto';

export class MapsCheckoutController {
  constructor(
    private createMapsInformationUseCase: CreateMapsInformation,
    private getMapsInformationUseCase: GetMapsInformation,
    private updateMapsInformationUseCase: UpdateMapsInformation,
  ) {}

  async createMapsData(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { maps } = req.body;

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

      const createMapList = new CreateMapsListDto();
      createMapList.maps = maps;

      logger.info(
        `Creando maps information para parent_id: ${decoded.parentId}`,
      );

      const result = await this.createMapsInformationUseCase.execute(
        createMapList,
        Number(decoded.parentId),
      );

      if (!result) {
        return res.status(400).json({
          success: false,
          message: 'Failed to create maps information',
        });
      }

      logger.info(
        `Creado con exito la informacion de maps para parent_id: ${decoded.parentId}`,
      );

      return res.status(201).json({
        success: true,
        data: 'Informacion de direccion guardada',
        message: 'Informacion de maps creada con exito',
      });
    } catch (error) {
      logger.error('Error en createMapsData:', error);
      next(error);
    }
  }

  async getMapByParent(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

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

      logger.info(`Obteniendo mapas para parent_id: ${decoded.parentId}`);

      const result = await this.getMapsInformationUseCase.execute(
        Number(decoded.parentId),
      );

      return res.status(200).json({
        success: true,
        message: `Se encontraron ${result.length} actividades`,
        data: result,
      });
    } catch (error) {
      logger.error('Error en getMapByParent:', error);
      next(error);
    }
  }

  async updateInformationMap(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { id, typeMap, latitude, longitude } = req.body;

      if (!id || !typeMap || !latitude || !longitude) {
        return res.status(400).json({
          success: false,
          message: 'Todos los campos son requeridos',
          errorCode: 'BAD_REQUEST',
        });
      }

      const authHeader = req.headers.authorization;

      const token =
        authHeader && authHeader.startsWith('Bearer ')
          ? authHeader.substring(7)
          : null;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token no encontrado',
          errorCode: 'UNAUTHORIZED',
        });
      }

      const decoded = decodeToken(token);
      logger.info(decoded);

      if (!decoded?.parentId || !decoded?.childrenId || !decoded?.email) {
        return res
          .status(401)
          .json({ error: 'Error autenticando Token, faltan datos' });
      }

      const updateInfo: UpdateMaps = {
        id: Number(id),
        typeMap,
        latitude: Number(latitude),
        longitude: Number(longitude),
      };

      const updateMapInformation =
        await this.updateMapsInformationUseCase.execute(updateInfo);
      if (updateMapInformation) {
        return res.status(200).json({
          success: true,
          message: 'Informacion de maps actualizada con exito',
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'No se encontro el mapa para actualizar',
          errorCode: 'NOT_FOUND',
        });
      }
    } catch (error) {
      logger.error('Error en updateInformationMap:', error);
      next(error);
    }
  }
}
