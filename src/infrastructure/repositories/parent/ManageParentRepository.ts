import bcrypt from 'bcrypt';
import { CreateParentDto } from '../../../domain/interfaces/dto/parent/CreateParentDto';
import { ManageParentRepo } from '../../../domain/interfaces/repositories/ManageParentRepo';
import { pool } from '../../database/dbConnection';
import { logger } from '../../logger';

export class ManageParentRepository implements ManageParentRepo {
  async register(
    createParentDto: CreateParentDto,
  ): Promise<{ parentId: number | null; error?: string }> {
    const client = await pool.connect();

    try {
      logger.info('Iniciando proceso de registro para padre/madre');
      await client.query('BEGIN');

      // Verificar si el email ya existe
      const emailCheck = await client.query(
        'SELECT 1 FROM padres WHERE email = $1 LIMIT 1',
        [createParentDto.email],
      );

      if (emailCheck.rows.length > 0) {
        logger.warn(
          `Intento de registro fallido - Email ya existe: ${createParentDto.email}`,
        );
        await client.query('ROLLBACK');
        return { parentId: null, error: 'EMAIL_ALREADY_EXISTS' };
      }

      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(createParentDto.password, 10);

      // Insertar nuevo padre/madre
      const result = await client.query(
        `INSERT INTO padres (pin_login, email, password, full_name) 
                 VALUES ($1, $2, $3, $4) 
                 RETURNING parent_id`,
        [
          createParentDto.pinParent,
          createParentDto.email,
          hashedPassword,
          createParentDto.fullName,
        ],
      );

      const insertedId = result.rows[0]?.parent_id;

      if (!insertedId) {
        throw new Error('No se pudo obtener el ID del padre/madre insertado');
      }

      await client.query('COMMIT');
      logger.info(`Registro exitoso para parentId: ${insertedId}`);

      return { parentId: insertedId };
    } catch (error: any) {
      await client.query('ROLLBACK');

      // Manejo específico para violación de constraint único
      if (error.code === '23505') {
        // Código de error PostgreSQL para violación de unicidad
        logger.warn(
          `Intento de registro fallido - Email ya existe: ${createParentDto.email}`,
        );
        return {
          parentId: null,
          error:
            error.constraint === 'padres_email_key'
              ? 'EMAIL_ALREADY_EXISTS'
              : 'PIN_ALREADY_EXISTS',
        };
      }

      logger.error('Error registrando padre/madre:', error);
      return { parentId: null, error: 'DATABASE_ERROR' };
    } finally {
      client.release();
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<{
    parentId: number | null;
    childrenId: number | null;
    error?: string;
  }> {
    const client = await pool.connect();

    try {
      logger.info(`Iniciando proceso de login para email: ${email}`);
      await client.query('BEGIN');

      // 1. Verificar credenciales del padre/madre
      const parentQuery = await client.query(
        `SELECT parent_id, password FROM padres 
         WHERE email = $1`,
        [email],
      );

      if (!parentQuery.rows.length) {
        logger.warn(`Intento de login fallido - Email no encontrado: ${email}`);
        await client.query('ROLLBACK');
        return { parentId: null, childrenId: null, error: 'EMAIL_NOT_EXIST' };
      }

      const parent = parentQuery.rows[0];
      const passwordMatch = await bcrypt.compare(password, parent.password);

      if (!passwordMatch) {
        logger.warn(
          `Intento de login fallido - Contraseña incorrecta para email: ${email}`,
        );
        await client.query('ROLLBACK');
        return {
          parentId: null,
          childrenId: null,
          error: 'PASSWORD_NOT_FOUND',
        };
      }

      // 2. Obtener el hijo asociado (asumiendo exactamente 1 hijo por padre)
      const childrenQuery = await client.query(
        `SELECT children_id FROM ninos 
         WHERE parent_id = $1 
         LIMIT 1`, // Aseguramos solo un resultado
        [parent.parent_id],
      );

      if (!childrenQuery.rows.length) {
        logger.error(
          `Padre encontrado pero sin niño asociado para parentId: ${parent.parent_id}`,
        );
        await client.query('ROLLBACK');
        return {
          parentId: null,
          childrenId: null,
          error: 'PARENT_NOT_FOUND',
        };
      }

      const childrenId = childrenQuery.rows[0].children_id;

      await client.query('COMMIT');
      logger.info(
        `Login exitoso para parentId: ${parent.parent_id} con childrenId: ${childrenId}`,
      );

      return {
        parentId: parent.parent_id,
        childrenId: childrenId,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error(`Error durante login para email ${email}:`, error);
      throw error;
    } finally {
      client.release();
    }
  }
}
