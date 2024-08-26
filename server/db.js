import pkg from "pg";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

if (
  !process.env.SERVER_HOST ||
  !process.env.PG_DATABASE ||
  !process.env.JWT_SECRET
) {
  throw new Error("Missing required environment variables");
}

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.SERVER_HOST,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

export default pool;
