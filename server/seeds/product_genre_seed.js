/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("products_genre").del();
  await knex("products_genre").insert([
    { id: 1, name: "Action" },
    { id: 2, name: "Adventure" },
    { id: 3, name: "Fantasy" },
  ]);
};
