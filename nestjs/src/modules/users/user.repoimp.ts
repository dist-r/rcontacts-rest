import { Injectable } from '@nestjs/common';
import IUserRepository from './user.irepository';
import { PostgresService } from 'src/common/database/raw/postgres.service';
import { User } from './contract/types/interface.user';

@Injectable()
export class PostgresUserRepository implements IUserRepository {
  constructor(private readonly pgService: PostgresService) {}

  async save(user: User): Promise<User> {
    const query = `INSERT INTO users (id, username, name, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const params = [
      user.id,
      user.username,
      user.name,
      user.email,
      user.password,
    ];
    try {
      const result = await this.pgService.query(query, params);
      return result[0] as User;
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<User> {
    const query = `SELECT * FROM users WHERE id = $1`;
    const params = [id];
    try {
      const result = await this.pgService.query(query, params);
      return result[0] as User;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User> {
    const query = `SELECT * FROM users WHERE email = $1`;
    const params = [email];
    try {
      const result = await this.pgService.query(query, params);
      return result[0] as User;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }
}
