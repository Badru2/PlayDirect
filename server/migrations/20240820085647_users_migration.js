/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id").primary();
    table.string("username");
    table.string("email").unique();
    table.string("password");
    table.string("avatar");
    table.string("phone");
    table.string("address");
    table.string("role");
    table.timestamps();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable("users");
}
