import { GetMapsInformationDto } from '../../../domain/interfaces/dto/maps/GetMapInformationDto';
import { MapInformationDto } from '../../../domain/interfaces/dto/maps/MapInformationDto';
import { UpdateMaps } from '../../../domain/interfaces/dto/maps/UpdateMapsDto';
import { ManageMapsRepo } from '../../../domain/interfaces/repositories/ManageMapsRepo';
import { pool } from '../../database/dbConnection';
import { logger } from '../../logger';

export class ManageMapsRepository implements ManageMapsRepo {
  async createMapsInformation(
    createMapList: MapInformationDto[],
    parent_id: number,
  ): Promise<boolean> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (const map of createMapList) {
        const query = `
          INSERT INTO parent_locations (parent_id, type, latitude, longitude)
          VALUES ($1, $2, $3, $4)
        `;
        const values = [parent_id, map.typeMap, map.latitude, map.longitude];

        await client.query(query, values);
      }

      await client.query('COMMIT');
      return true;
    } catch (error: any) {
      await client.query('ROLLBACK');
      logger.error('Error al guardar múltiples ubicaciones:', error);
      return false;
    } finally {
      client.release();
    }
  }
  async getMapsInformation(
    parent_id: number,
  ): Promise<GetMapsInformationDto[]> {
    try {
      let queryMapsInformation = `
        SELECT 
          id,
          type,
          latitude,
          longitude
        FROM parent_locations
        WHERE parent_id = $1
      `;

      const values = [parent_id];

      const result = await pool.query(queryMapsInformation, values);

      const mapsInformation: GetMapsInformationDto[] = result.rows.map(
        (row) => ({
          id: row.id,
          typeMap: row.type,
          latitude: row.latitude,
          longitude: row.longitude,
        }),
      );

      return mapsInformation;
    } catch (error) {
      logger.error('Error al obtener información de maps:', error);
      throw new Error('Error al obtener información de maps');
    }
  }

  async updateMapsInformation(
    updateMapInformation: UpdateMaps,
  ): Promise<boolean> {
    try {
      const query = `
        UPDATE parent_locations
        SET type = $1, latitude = $2, longitude = $3
        WHERE id = $4
      `;
      const values = [
        updateMapInformation.typeMap,
        updateMapInformation.latitude,
        updateMapInformation.longitude,
        updateMapInformation.id,
      ];

      const result = await pool.query(query, values);

      if (result.rowCount === 0) {
        logger.warn(
          `No se encontró el mapa con id ${updateMapInformation.id} para actualizar.`,
        );
        return false;
      }
      logger.info(
        `Mapa con id ${updateMapInformation.id} actualizado exitosamente.`,
      );
      return true;
    } catch (error) {
      logger.error('Error al actualizando información de maps:', error);
      throw new Error('Error al actualizar información de maps');
    }
  }
}
