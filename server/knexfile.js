// Import the dotenv package and configure it to load environment variables
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const knexConfig = {
  development: {
    client: "pg", // Use 'pg' for PostgreSQL
    connection: {
      host: process.env.SERVER_HOST, // Usually localhost for development
      database: process.env.PG_DATABASE, // Your development database name
      user: process.env.PG_USER, // Your development database user
      password: process.env.PG_PASSWORD, // Your development database password
    },
    migrations: {
      directory: "./migrations", // Directory to store migration files
    },
    seeds: {
      directory: "./seeds", // Directory to store seed files
    },
  },

  staging: {
    client: "pg", // Use 'pg' for PostgreSQL
    connection: {
      host: process.env.STAGING_PG_HOST, // Staging database host
      database: process.env.STAGING_PG_DATABASE, // Staging database name
      user: process.env.STAGING_PG_USER, // Staging database user
      password: process.env.STAGING_PG_PASSWORD, // Staging database password
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations/staging", // Directory to store staging migration files
    },
  },

  production: {
    client: "pg", // Use 'pg' for PostgreSQL
    connection: {
      host: process.env.PROD_PG_HOST, // Production database host
      database: process.env.PROD_PG_DATABASE, // Production database name
      user: process.env.PROD_PG_USER, // Production database user
      password: process.env.PROD_PG_PASSWORD, // Production database password
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations/production", // Directory to store production migration files
    },
  },
};

// Export the configuration object as the default export
export default knexConfig;
