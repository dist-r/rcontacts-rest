import { pgPool } from "src/config/database/postgresql.config";
import { Injectable } from "@nestjs/common";
  
@Injectable()
export class PostgresService {

  private pool = pgPool;

  async query(query: string, params?: any[]): Promise<any> {
    try {
      const result = await this.pool.query(query, params);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}