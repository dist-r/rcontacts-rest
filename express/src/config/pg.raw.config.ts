import { Pool } from "pg";

class PgDatabase {
  
  private pool: Pool;

  constructor() {
    
    const isDocker = process.env.IS_DOCKER === "true";
  
    this.pool = new Pool({
      user: process.env.PG_USER || "pgdb",
      host: isDocker ? process.env.PG_HOST : "localhost",
      database: process.env.PG_DATABASE || "pgdb",
      password: process.env.PG_PASSWORD || "pgdb",
      port: parseInt(process.env.PG_PORT || "5432", 10),
    });
  }

  getPool(): Pool {
    return this.pool;
  }
}

export default PgDatabase;