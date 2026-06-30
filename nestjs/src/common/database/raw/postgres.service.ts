import { pgPool } from 'src/config/database/postgresql.config';
import { Injectable } from '@nestjs/common';
import { QueryResultRow } from 'pg';

@Injectable()
export class PostgresService {
  private pool = pgPool;

  async query<T extends QueryResultRow>(
    query: string,
    params?: any[],
  ): Promise<T[]> {
    const result = await this.pool.query<T>(query, params);
    return result.rows;
  }
}
