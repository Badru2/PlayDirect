/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("products_category").del();
  await knex("products_category").insert([
    { id: 1, name: "Game" },
    { id: 2, name: "Console" },
  ]);
};
