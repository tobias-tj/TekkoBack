import { CreateActivityDetailsDto } from '../../../domain/interfaces/dto/activity/CreateActivityDetailsDto';
import { CreateActivityDto } from '../../../domain/interfaces/dto/activity/CreateActivityDto';
import { GetActivityDto } from '../../../domain/interfaces/dto/activity/GetActivityDto';
import { ManageActivityRepo } from '../../../domain/interfaces/repositories/ManageActivityRepo';
import { pool } from '../../database/dbConnection';
import { logger } from '../../logger';

export class ManageActivityRepository implements ManageActivityRepo {
  async createActivityDetails(
    activityDetails: CreateActivityDetailsDto,
  ): Promise<{ activityDetailId: number | null; error?: string }> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const detailQuery = `
            INSERT INTO detalles_actividades (
              start_activity_time, 
              expiration_activity_time, 
              title_activity, 
              description_activity, 
              experience_activity
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING activity_detail_id
          `;

      const detailValues = [
        activityDetails.start_activity_time,
        activityDetails.expiration_activity_time,
        activityDetails.title_activity,
        activityDetails.description_activity,
        activityDetails.experience_activity,
      ];

      const result = await client.query(detailQuery, detailValues);
      const activityDetailId = result.rows[0]?.activity_detail_id;

      if (!activityDetailId) {
        throw new Error('No se pudo obtener el ID de la actividad');
      }

      await client.query('COMMIT');
      return { activityDetailId };
    } catch (error: any) {
      await client.query('ROLLBACK');
      logger.error('Error in createActivityDetails:', {
        error: error.message,
        stack: error.stack,
        details: activityDetails,
      });
      return { activityDetailId: null, error: error.message };
    } finally {
      client.release();
    }
  }

  async createActivity(
    activity: CreateActivityDto,
  ): Promise<{ activityId: number | null }> {
    try {
      const activityQuery = `
        INSERT INTO Actividades (
          activity_detail_id, 
          children_id, 
          parent_id, 
          status, 
          status_ref
        ) VALUES ($1, $2, $3, 'PENDING', $4)
        RETURNING activity_id
      `;

      const values = [
        activity.activity_detail_id,
        activity.children_id,
        activity.parent_id,
        activity.status_ref || null,
      ];

      const result = await pool.query(activityQuery, values);

      if (result.rows.length === 0) {
        throw new Error('No se pudo insertar la actividad');
      }

      return { activityId: result.rows[0].activity_id };
    } catch (error) {
      logger.error('Error en ActivityRepository.createActivity:', error);
      throw error;
    }
  }

  async getActivity(
    dateFilter: string,
    parentId: number,
    statusFilter: string | null,
  ): Promise<GetActivityDto[]> {
    try {
      // Base de la consulta SQL
      let queryGetActivity = `
            SELECT 
                da.activity_detail_id,
                da.start_activity_time,
                da.expiration_activity_time,
                da.title_activity,
                da.description_activity,
                da.experience_activity,
                a.activity_id,
                a.children_id,
                a.parent_id,
                a.status
            FROM 
                detalles_actividades da
            JOIN 
                actividades a ON da.activity_detail_id = a.activity_detail_id
            WHERE 
                $1::date BETWEEN da.start_activity_time::date AND da.expiration_activity_time::date
                AND a.parent_id = $2
        `;

      // Si hay un filtro de estado, lo agregamos a la consulta
      if (statusFilter) {
        queryGetActivity += ` AND a.status = $3`;
      }

      // Creamos el arreglo de valores para la consulta
      const values: (string | number)[] = [dateFilter, parentId];

      // Si hay un filtro de estado, lo agregamos al arreglo de valores
      if (statusFilter) {
        values.push(statusFilter);
      }

      const result = await pool.query(queryGetActivity, values);

      logger.info(
        `Actividades encontradas para ${dateFilter}: ${result.rowCount}`,
      );

      return result.rows.map((row) => ({
        ...row,
        start_activity_time: new Date(row.start_activity_time).toLocaleString(
          'es-PY',
          { timeZone: 'America/Asuncion' },
        ),
        expiration_activity_time: new Date(
          row.expiration_activity_time,
        ).toLocaleString('es-PY', { timeZone: 'America/Asuncion' }),
      }));
    } catch (error) {
      logger.error('Error en ActivityRepository.createActivity:', error);
      throw error;
    }
  }
}
