import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

if (
  !process.env.SERVER_HOST ||
  !process.env.PG_DATABASE ||
  !process.env.JWT_SECRET
) {
  throw new Error("Missing required environment variables");
}

const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.SERVER_HOST,
    dialect: "postgres",
    port: process.env.PG_PORT,
    logging: false, // Disable logging; default: console.log
  }
);

export default sequelize;
