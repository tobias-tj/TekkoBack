import { CreateKidDto } from '../../domain/interfaces/dto/kids/CreateKidDto';
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
}
