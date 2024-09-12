/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable(
    "products_update_stock_history",
    function (table) {
      table.bigIncrements("id").primary();
      table.integer("user_id");
      table.foreign("user_id").references("id").inTable("users");
      table.integer("product_id");
      table.foreign("product_id").references("id").inTable("products");
      table.integer("old_stock");
      table.integer("new_stock");
      table.timestamps();
    }
  );
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable("products_update_stock_history");
}
