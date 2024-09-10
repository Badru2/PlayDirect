import bcrypt from "bcrypt";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();

  // Hash the passwords
  const hashedPassword = await bcrypt.hash("12345678", 10);

  // Insert seed data
  await knex("users").insert([
    {
      id: 1,
      username: "Fii",
      email: "fii@gmail.com",
      password: hashedPassword,
      role: "superAdmin",
    },
    {
      id: 2,
      username: "Ruu",
      email: "ruu@gmail.com",
      password: hashedPassword,
      role: "admin",
    },
    {
      id: 3,
      username: "Fuu",
      email: "fuu@gmail.com",
      password: hashedPassword,
      role: "user",
    },
  ]);
};
