import { Pool } from "pg";

const pool = new Pool({
  user: "pgdb",
  host: "localhost",
  database: "pgdb",
  password: "pgdb",
  port: 5432,
});

export default pool;