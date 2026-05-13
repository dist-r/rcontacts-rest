import { Pool } from "pg";
import { User } from "../../modules/user/user";
import IUserRepository from "../../modules/user/user.repository";

export default class PgUserRepository implements IUserRepository {
  constructor(private pool: Pool) {}

  async createUser(name: string, email: string, password: string): Promise<void | Error> {
    const id = crypto.randomUUID();
    const newUser: User = {
      id,
      name,
      email,
      password,
    };

    await this.pool.query(
      `INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)`,
      [newUser.id, newUser.name, newUser.email, newUser.password]
    );

    return;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await this.pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

    if (result.rows.length === 0) {
      return null;
    }

    const user: User = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      password: result.rows[0].password,
    };

    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await this.pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    const user: User = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      password: result.rows[0].password,
    };

    return user;
  }
}