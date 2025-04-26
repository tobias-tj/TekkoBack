import { GetProfileDto } from '../../../domain/interfaces/dto/settings/GetProfileDto';
import { UpdateProfile } from '../../../domain/interfaces/dto/settings/UpdateProfileDto';
import { ManageSettingsRepo } from '../../../domain/interfaces/repositories/ManageSettingsRepo';
import { pool } from '../../database/dbConnection';
import { logger } from '../../logger';

export class ManageSettingsRepository implements ManageSettingsRepo {
  async getDetailsProfile(
    parentId: number,
    childrenId: number,
  ): Promise<GetProfileDto> {
    try {
      let queryDetailsProfile = `
        SELECT 
        p.full_name AS parent_name,
        p.email,
        n.full_name AS child_name,
        n.age,
        COUNT(DISTINCT CASE WHEN a.parent_id = $1 THEN a.activity_id END) AS total_activities_created_by_parent,
        COUNT(DISTINCT CASE WHEN a.children_id = $2 AND a.status = 'COMPLETED' THEN a.activity_id END) AS total_completed_activities_by_child
        FROM 
            padres p
        CROSS JOIN 
            ninos n
        LEFT JOIN 
            actividades a ON (a.parent_id = p.parent_id OR a.children_id = n.children_id)
        WHERE 
            p.parent_id = $1 AND n.children_id = $2
        GROUP BY 
            p.full_name, p.email, n.full_name, n.age;
        `;

      const values = [parentId, childrenId];

      const result = await pool.query(queryDetailsProfile, values);

      const row = result.rows[0];
      const response: GetProfileDto = {
        parent_name: row.parent_name,
        email: row.email,
        childName: row.child_name,
        age: row.age,
        total_activities_created_by_parent:
          row.total_activities_created_by_parent,
        total_completed_activities_by_child:
          row.total_completed_activities_by_child,
      };

      logger.info(`Informacion del perfil: ${row.email}:`, response);
      return response;
    } catch (error) {
      logger.error(`Error obteniendo informacion del perfil: ${error}`);
      throw error;
    }
  }

  async updateProfileData(profileUpdateDto: UpdateProfile): Promise<boolean> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Actualizar hijo si corresponde
      if (profileUpdateDto.childrenName || profileUpdateDto.age !== undefined) {
        const updateChildQuery = `
          UPDATE ninos
          SET 
            full_name = COALESCE(NULLIF($1, ''), full_name),
            age = COALESCE($2, age)
          WHERE children_id = $3 AND parent_id = $4
          RETURNING *;
        `;

        await client.query(updateChildQuery, [
          profileUpdateDto.childrenName ?? '',
          profileUpdateDto.age ?? null,
          profileUpdateDto.childrenId,
          profileUpdateDto.parentId,
        ]);
      }

      // Actualizar padre si corresponde
      if (profileUpdateDto.parentName) {
        const updateParentQuery = `
          UPDATE padres
          SET 
            full_name = COALESCE(NULLIF($1, ''), full_name)
          WHERE parent_id = $2
          RETURNING *;
        `;

        await client.query(updateParentQuery, [
          profileUpdateDto.parentName,
          profileUpdateDto.parentId,
        ]);
      }

      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error actualizando el perfil', { error });
      return false;
    } finally {
      client.release();
    }
  }

  async updatePinAccount(
    parentId: number,
    pinToken: string,
    oldToken: string,
  ): Promise<boolean> {
    try {
      logger.info(
        `Inicia proceso para actualizar el pin con parent ID: ${parentId}`,
      );

      // 1. Verificar si el oldToken coincide con el guardado
      const querySelectOldPin = `
        SELECT pin_login FROM padres WHERE parent_id = $1;
      `;
      const result = await pool.query(querySelectOldPin, [parentId]);

      if (result.rowCount === 0) {
        logger.warn(`No se encontró ningún padre con ID: ${parentId}`);
        return false;
      }

      const currentToken = result.rows[0].pin_login;

      if (currentToken !== oldToken) {
        logger.warn(
          `El oldToken no coincide para el padre con ID: ${parentId}`,
        );
        return false;
      }

      // 2. Actualizar el token
      const queryUpdatePin = `
        UPDATE padres 
        SET pin_login = $1
        WHERE parent_id = $2;
      `;
      const values = [pinToken, parentId];

      await pool.query(queryUpdatePin, values);

      logger.info(`Padre con ID: ${parentId} actualizado con éxito`);
      return true;
    } catch (error) {
      logger.error('Error actualizando el pin de los padres', { error });
      throw new Error('Error actualizando el pin en la base de datos');
    }
  }
}
