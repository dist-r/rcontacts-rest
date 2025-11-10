import { Pool } from "pg";

const isDocker = process.env.DOCKER_ENV === "true";

const poolPg = new Pool({
  user: process.env.POSTGRES_USER,
  host: isDocker ? process.env.POSTGRES_HOST_COMPOSE : process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
});

poolPg.connect()
  .then(() => console.log("✅ Connected to Postgres"))
  .catch((err) => console.error("❌ Error connecting to Postgres:", err));

export default poolPg;