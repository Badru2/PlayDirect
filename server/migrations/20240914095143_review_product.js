/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("review_product", function (table) {
    table.increments();
    table.integer("product_id").unsigned().notNullable();
    table.integer("user_id").unsigned().notNullable();
    table.integer("rating").notNullable();
    table.string("comment").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.foreign("product_id").references("id").inTable("product");
    table.foreign("user_id").references("id").inTable("user");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable("review_product");
}
