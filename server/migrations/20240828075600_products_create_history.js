/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("products_create_history", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.decimal("price", 10, 2).notNullable();
    table.json("images");
    table.integer("category_id").unsigned();
    table.foreign("category_id").references("id").inTable("products_category");
    table.json("genre_id");
    table.integer("user_id").unsigned();
    table.foreign("user_id").references("id").inTable("users");
    table.text("description");
    table.timestamps();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable("products_create_history");
}
