import ILogger from "../../config/logger/ilogger";
import { User } from "../../modules/user/user";
import { Pool } from "pg";
import IUserRepository from "../../modules/user/user.respository";

export default class PostgresUserRepository implements IUserRepository{

  constructor(private db: Pool, private logger: ILogger) {}
  
  async create(id: string, username: string, name: string, email: string, password: string): Promise<User> {
    
    this.logger.info("Creating user", { username });
   
    const newUser : User = {
      id,
      username,
      name,
      email,
      password
    }
    try {
      const result = await this.db.query(`INSERT INTO users (id, username, name, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [
        newUser.id,
        newUser.username,
        newUser.name,
        newUser.email,
        newUser.password, 
      ])

      if (result.rows.length === 0) {
        throw new Error("Failed to create user")
      }

      const user : User = {
        id: result.rows[0].id,
        username: result.rows[0].username,
        name: result.rows[0].name,
        email: result.rows[0].email,
        password: result.rows[0].password
      }

      this.logger.info("User created successfully", { userId: newUser.id });
      return user
    } catch (error) {
      this.logger.error("Error creating user", error, { username });
      throw error;
    }
  }

  async findByID(id: string): Promise<User | null> {
    
    this.logger.debug("Finding user by ID", { userId: id });
    try {
      const result = await this.db.query("SELECT * FROM users WHERE id = $1", [id])
      if (result.rows.length === 0) {
        return null
      }
      const user : User = {
        id: String(result.rows[0].id),
        username: String(result.rows[0].username),
        name: String(result.rows[0].name),
        email: String(result.rows[0].email),
        password: String(result.rows[0].password)
      }
      this.logger.debug("User found by ID", { userId: id });
      return user
    } catch (error) {
      this.logger.error("Error finding user by ID", error, {userId : id});
      throw error;
    }

  }

  async findByEmail(email: String): Promise<User | null>{
    
    this.logger.debug("Finding user by email",{email});
    try {
      const result = await this.db.query("SELECT * FROM users WHERE email = $1", [email])
      if (result.rows.length === 0) {
        return null
      }
      const user : User = {
        id: result.rows[0].id,
        username: result.rows[0].username,
        name: result.rows[0].name,
        email: result.rows[0].email,
        password: result.rows[0].password
      }
      this.logger.debug("User found by email", { email });
      return user
    } catch (error) {
      this.logger.error("Error finding user by email", { email, error });
      throw error;
    }

  }
}