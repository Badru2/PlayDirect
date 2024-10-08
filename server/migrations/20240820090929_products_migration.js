/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("products", function (table) {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.integer("price").notNullable();
    table.json("images"); // Change from string to json
    table.integer("category_id").unsigned();
    table
      .foreign("category_id")
      .references("id")
      .inTable("products_category")
      .onDelete("CASCADE");
    table.json("genre_id"); // Changed from integer to JSON
    table.integer("user_id").unsigned();
    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.text("description");
    table.integer("stock");
    table.integer("clicked").defaultTo(0);
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
