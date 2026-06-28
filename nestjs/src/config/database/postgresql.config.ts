import {Pool} from "pg";

export const pgPool = new Pool({
  user: process.env.POSTGRES_USER || "pgdb",
  host: process.env.POSTGRES_HOST || "localhost",
  database: process.env.POSTGRES_DB || "pgdb",
  password: process.env.POSTGRES_PASSWORD || "pgdb",
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
});