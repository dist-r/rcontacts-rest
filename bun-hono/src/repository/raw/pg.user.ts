import { User } from "../../modules/user/user";
import UserRepository from "../../modules/user/user.respository";
import { Pool } from "pg";
import { appLog } from "../../config/logger.pino";

export default class PostgresUserRepository implements UserRepository{

  constructor(private db: Pool) {}
  
  async create(username: string, name: string, email: string, password: string): Promise<void> {
    appLog.debug("create pg user raw called")
    const id = crypto.randomUUID()
    const newUser : User = {
      id,
      username,
      name,
      email,
      password
    }

    await this.db.query(`INSERT INTO users (id, username, name, email, password) VALUES ($1, $2, $3, $4, $5)`, [
      newUser.id,
      newUser.username,
      newUser.name,
      newUser.email,
      newUser.password, 
    ])
  }

  async findByID(id: string): Promise<User | undefined> {
    const result = await this.db.query("SELECT * FROM users WHERE id = $1", [id])
    if (result.rows.length === 0) {
      return undefined
    }
    const user : User = {
      id: String(result.rows[0].id),
      username: String(result.rows[0].username),
      name: String(result.rows[0].name),
      email: String(result.rows[0].email),
      password: String(result.rows[0].password)
    }
    return user
  }

  async findByEmail(email: String): Promise<User | undefined>{
    const result = await this.db.query("SELECT * FROM users WHERE email = $1", [email])
    if (result.rows.length === 0) {
      return undefined
    }
    const user : User = {
      id: result.rows[0].id,
      username: result.rows[0].username,
      name: result.rows[0].name,
      email: result.rows[0].email,
      password: result.rows[0].password
    }
    return user
  }
}