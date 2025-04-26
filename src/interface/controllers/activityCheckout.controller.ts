import { NextFunction, Request, Response } from 'express';
import { CreateActivityDetails } from '../../usecases/activity/createActivityDetails';
import { Activity } from '../../domain/entities/Activity';
import { logger } from '../../infrastructure/logger';
import { CreateActivityDto } from '../../domain/interfaces/dto/activity/CreateActivityDto';
import { CreateActivity } from '../../usecases/activity/createActivity';
import { CreateActivityDetailsDto } from '../../domain/interfaces/dto/activity/CreateActivityDetailsDto';
import { validationResult } from 'express-validator';
import { GetActivity } from '../../usecases/activity/getActivity';
import { GetActivityByKids } from '../../usecases/activity/getActivityByKid';
import { UpdateActivityStatusById } from '../../usecases/activity/updateActivityStatusById';
import { decodeToken } from '../../domain/interfaces/middleware/jwtMiddleware';

export class ActivityCheckoutController {
  constructor(
    private createActivityDetailUseCase: CreateActivityDetails,
    private createActivityUseCase: CreateActivity,
    private getActivityUseCase: GetActivity,
    private getActivityKidUseCase: GetActivityByKids,
    private updateActivityStatusUseCase: UpdateActivityStatusById,
  ) {}

  async createActivityData(req: Request, res: Response, next: NextFunction) {
    try {
      const { detail } = req.body;

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

      const activityDetailsDto = new CreateActivityDetailsDto({
        start_activity_time: detail.start_activity_time,
        expiration_activity_time: detail.expiration_activity_time,
        title_activity: detail.title_activity,
        description_activity: detail.description_activity,
        experience_activity: detail.experience_activity,
      });

      logger.info(
        `Creando actividad para children_id: ${decoded.childrenId} y parent_id: ${decoded.parentId}`,
      );

      const { activityDetailId, error } =
        await this.createActivityDetailUseCase.execute(activityDetailsDto);

      if (!activityDetailId || error) {
        return res.status(400).json({
          success: false,
          message: error || 'Failed to create activity details',
        });
      }

      const createActivityDto = new CreateActivityDto(
        activityDetailId,
        decoded.childrenId,
        Number(decoded.parentId),
        'PENDING',
      );

      // Crear la actividad Principal
      const activityId =
        await this.createActivityUseCase.execute(createActivityDto);
      if (!activityId) {
        logger.error('No se pudo crear la actividad principal');
        return res.status(500).json({
          success: false,
          message: 'No se ha logrado crear la actividad',
        });
      }

      logger.info(`Actividad creada con ID: ${activityId}`);

      return res.status(201).json({
        success: true,
        message: 'Actividad creada exitosamente',
        data: {
          activityId,
          activityDetailId,
        },
      });
    } catch (error) {
      logger.error('Error en createActivityData:', error);
      next(error);
    }
  }

  async getAllActivityData(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { dateFilter, statusFilter } = req.query;

      if (!dateFilter || typeof dateFilter !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'El parámetro "dateFilter" es requerido',
          errorCode: 'BAD_REQUEST',
        });
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

      logger.info(`Obteniendo actividades para la fecha: ${dateFilter}`);

      const activities = await this.getActivityUseCase.execute(
        dateFilter,
        Number(decoded.parentId),
        statusFilter?.toString() || null,
      );

      return res.status(200).json({
        success: true,
        message: `Se encontraron ${activities.length} actividades`,
        data: activities,
      });
    } catch (error) {
      logger.error('Error en getAllActivityData:', error);
      next(error);
    }
  }

  async getActivityByKids(req: Request, res: Response, next: NextFunction) {
    try {
      const { dateFilter } = req.query;

      if (!dateFilter || typeof dateFilter !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'El parámetro "dateFilter" es requerido',
          errorCode: 'BAD_REQUEST',
        });
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

      logger.info(`Obteniendo actividades para la fecha: ${dateFilter}`);

      const activities = await this.getActivityKidUseCase.execute(
        dateFilter,
        decoded.childrenId,
      );

      logger.info('Las actividades obtenidas:');
      logger.info(activities);

      return res.status(200).json({
        success: true,
        message: `Se encontraron ${activities.length} actividades`,
        data: activities,
      });
    } catch (error) {
      logger.error('Error en getAllActivityData:', error);
      next(error);
    }
  }

  async updateActivityStatus(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { activityId } = req.body;

      if (!activityId) {
        return res.status(400).json({
          success: false,
          message: 'El parámetro "activityId" es requerido',
          errorCode: 'BAD_REQUEST',
        });
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

      const activityStatus =
        await this.updateActivityStatusUseCase.execute(activityId);
      logger.info('Actividad actualizado con exito');
      if (activityStatus) {
        res.status(200).json({ data: 'Actividad actualizado con Exito' });
      } else {
        res
          .status(200)
          .json({ data: 'No se ha encontrado la Actividad solicitada' });
      }
    } catch (error) {
      logger.error('Error actualizando la Actividad', { error });
      next(error);
    }
  }
}
