import { CreateKidDto } from '../../domain/interfaces/dto/kids/CreateKidDto';
import { ExperienceDto } from '../../domain/interfaces/dto/kids/ExperienceDto';
import { ManageKidRepo } from '../../domain/interfaces/repositories/ManageKidRepo';
import { pool } from '../database/dbConnection';
import { logger } from '../logger';

export class ManageKidRepository implements ManageKidRepo {
  async register(createKidDto: CreateKidDto): Promise<number | null> {
    try {
      logger.info('Inicia proceso para registrar nuevos niños');

      const result = await pool.query(
        'INSERT INTO ninos (full_name, age, parent_id) VALUES ($1, $2, $3) RETURNING children_id',
        [createKidDto.name, createKidDto.age, createKidDto.parentId],
      );

      const insertedId = result.rows[0]?.children_id;
      return insertedId || null;
    } catch (error) {
      logger.error('Error registrando niños: ' + error);
      return null;
    }
  }

  async getExperience(childrenId: number): Promise<ExperienceDto> {
    try {
      logger.info(`Obteniendo experiencia para niño ID: ${childrenId}`);

      // Validación temprana del ID
      if (!childrenId || childrenId <= 0) {
        throw new Error('ID de niño inválido');
      }

      // Usar parámetros preparados para evitar SQL injection
      const sql = `
            SELECT 
                full_name,
                exp,
                (obtener_nivel_info(exp)).nivel_actual as level,
                (obtener_nivel_info(exp)).exp_faltante as exp_next_level,
                (obtener_nivel_info(exp)).siguiente_nivel as next_level
            FROM Ninos
            WHERE children_id = $1
        `;

      const result = await pool.query(sql, [childrenId]);

      if (!result.rows?.length) {
        logger.warn(`No se encontró niño con ID: ${childrenId}`);
        return this.getDefaultExperienceDto();
      }

      const row = result.rows[0];
      const response: ExperienceDto = {
        fullName: row.full_name,
        exp: row.exp,
        level: row.level,
        expNextLevel: row.exp_next_level,
        nextLevel: row.next_level,
      };

      logger.info(`Experiencia obtenida para ${row.full_name}:`, response);
      return response;
    } catch (error) {
      logger.error(`Error obteniendo experiencia: ${error}`);
      // Retornar valores por defecto en caso de error
      return this.getDefaultExperienceDto();
    }
  }

  private getDefaultExperienceDto(): ExperienceDto {
    return {
      fullName: '',
      exp: 0,
      level: 1,
      expNextLevel: 40,
      nextLevel: 2,
    };
  }
}
