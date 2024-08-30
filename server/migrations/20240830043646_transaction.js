/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("transaction", (table) => {
    table.bigIncrements("id").primary();
    table.integer("user_id");
    table.foreign("user_id").references("id").inTable("users");
    table.json("cart_id");
    table.integer("total_price");
    table.timestamps();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable("transaction");
}
