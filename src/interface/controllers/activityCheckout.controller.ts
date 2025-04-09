import { NextFunction, Request, Response } from 'express';
import { CreateActivityDetails } from '../../usecases/activity/createActivityDetails';
import { Activity } from '../../domain/entities/Activity';
import { logger } from '../../infrastructure/logger';
import { CreateActivityDto } from '../../domain/interfaces/dto/activity/CreateActivityDto';
import { CreateActivity } from '../../usecases/activity/createActivity';
import { CreateActivityDetailsDto } from '../../domain/interfaces/dto/activity/CreateActivityDetailsDto';
import { validationResult } from 'express-validator';

export class ActivityCheckoutController {
  constructor(
    private createActivityDetailUseCase: CreateActivityDetails,
    private createActivityUseCase: CreateActivity,
  ) {}

  async createActivityData(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { detail, children_id, parent_id } = req.body;

      const activityDetailsDto = new CreateActivityDetailsDto({
        start_activity_time: detail.start_activity_time,
        expiration_activity_time: detail.expiration_activity_time,
        title_activity: detail.title_activity,
        description_activity: detail.description_activity,
        experience_activity: detail.experience_activity,
      });

      logger.info(
        `Creando actividad para children_id: ${children_id} y parent_id: ${parent_id}`,
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
        children_id,
        parent_id,
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
}
