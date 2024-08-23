/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("products", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.decimal("price", 10, 2).notNullable();
    table.string("image");
    table.integer("category_id").unsigned();
    table.foreign("category_id").references("id").inTable("products_category");
    table.integer("user_id").unsigned(); // id of the admin who created the product
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
  return knex.schema.dropTable("products");
}
