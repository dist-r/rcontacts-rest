import { Pool } from "pg";
import crypto from "crypto";
import { User } from "../../../modules/user/user";
import IUserRepository from "../../../modules/user/user.repository";
import ILogger from "../../../config/log/ilogger";

export default class PgUserRepository implements IUserRepository {
  
  constructor(
    private pool: Pool,
    private logger: ILogger
  ) {}

  async createUser(
    username: string,
    name: string,
    email: string,
    hashedPassword: string
  ): Promise<User> {

    const id = crypto.randomUUID();

    try {
      const result = await this.pool.query(
        `INSERT INTO users (id, username, name, email, password)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [id, username, name, email, hashedPassword]
      );

      return this.mapUser(result.rows[0]);
    
    } catch (error) {
      
      this.logger.error("Error creating user", error, { username, name, email });
      
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {

    try {
      
      const result = await this.pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return this.mapUser(result.rows[0]);
    
    } catch (error) {
      
      this.logger.error("Error fetching user by email", error, { email });
      
      throw error;
    }
  }

  async getUserById(id: string): Promise<User | null> {

    try {
      
      const result = await this.pool.query(
        `SELECT * FROM users WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return null;
      
      }
      return this.mapUser(result.rows[0]);
    
    } catch (error) {
      
      this.logger.error("Error fetching user by id", error, { id });
      
      throw error;
    
    }
  }

  private mapUser(row: any): User {

    const user: User = {
      id: row.id,
      username: row.username,
      name: row.name,
      email: row.email,
      password: row.password
    
    };
    
    return user;
  
  }
}