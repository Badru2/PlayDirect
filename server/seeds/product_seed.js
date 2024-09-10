/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("products").del();
  await knex("products").insert([
    {
      id: 1,
      name: "The Legend of Zelda: Breath of The Wild",
      price: 760000.0,
      images: JSON.stringify(["1725854616985-th.jpeg"]),
      category_id: 1,
      genre_id: JSON.stringify([1, 2]),
      user_id: 1,
      description:
        "This is the description for The Legend of Zelda: Breath of The Wild",
      clicked: 0,
    },
    {
      id: 2,
      name: "The Legend of Zelda: Ocarina of Time",
      price: 760000.0,
      images: JSON.stringify(["1725854616985-th.jpeg"]),
      category_id: 1,
      genre_id: JSON.stringify([1, 2]),
      user_id: 1,
      description:
        "This is the description for The Legend of Zelda: Ocarina of Time",
      clicked: 0,
    },
    {
      id: 3,
      name: "The Legend of Zelda: Majora's Mask",
      price: 760000.0,
      images: JSON.stringify(["1725854616985-th.jpeg"]),
      category_id: 1,
      genre_id: JSON.stringify([1, 2]),
      user_id: 1,
      description:
        "This is the description for The Legend of Zelda: Majora's Mask",
      clicked: 0,
    },
    {
      id: 4,
      name: "The Legend of Zelda: Skyward Sword",
      price: 760000.0,
      images: JSON.stringify(["1725854616985-th.jpeg"]),
      category_id: 1,
      genre_id: JSON.stringify([1, 2]),
      user_id: 1,
      description:
        "This is the description for The Legend of Zelda: Skyward Sword",
      clicked: 0,
    },
    {
      id: 5,
      name: "The Legend of Zelda: Wind Waker",
      price: 760000.0,
      images: JSON.stringify(["1725854616985-th.jpeg"]),
      category_id: 1,
      genre_id: JSON.stringify([1, 2]),
      user_id: 1,
      description:
        "This is the description for The Legend of Zelda: Wind Waker",
      clicked: 0,
    },
    {
      id: 6,
      name: "The Legend of Zelda: Tears of the Kingdom",
      price: 760000.0,
      images: JSON.stringify(["1725854616985-th.jpeg"]),
      category_id: 1,
      genre_id: JSON.stringify([1, 2]),
      user_id: 1,
      description:
        "This is the description for The Legend of Zelda: Tears of the Kingdom",
      clicked: 0,
    },
    {
      id: 7,
      name: "The Legend of Zelda: Link's Awakening",
      price: 760000.0,
      images: JSON.stringify(["1725854616985-th.jpeg"]),
      category_id: 1,
      genre_id: JSON.stringify([1, 2]),
      user_id: 1,
      description:
        "This is the description for The Legend of Zelda: Link's Awakening",
      clicked: 0,
    },
    {
      id: 8,
      name: "The Legend of Zelda: Oracle of Seasons",
      price: 760000.0,
      images: JSON.stringify(["1725854616985-th.jpeg"]),
      category_id: 1,
      genre_id: JSON.stringify([1, 2]),
      user_id: 1,
      description:
        "This is the description for The Legend of Zelda: Oracle of Seasons",
      clicked: 0,
    },
    {
      id: 9,
      name: "The Legend of Zelda: Oracle of Ages",
      price: 760000.0,
      images: JSON.stringify(["1725854616985-th.jpeg"]),
      category_id: 1,
      genre_id: JSON.stringify([1, 2]),
      user_id: 1,
      description:
        "This is the description for The Legend of Zelda: Oracle of Ages",
      clicked: 0,
    },
    {
      id: 10,
      name: "The Legend of Heroes: Trails in the Sky SC",
      price: 760000.0,
      images: JSON.stringify(["1725854616985-th.jpeg"]),
      category_id: 1,
      genre_id: JSON.stringify([1, 2]),
      user_id: 1,
      description:
        "This is the description for The Legend of Heroes: Trails in the Sky SC",
      clicked: 0,
    },
    {
      id: 11,
      name: "The Legend of Heroes: Trails in the Sky FC",
      price: 760000.0,
      images: JSON.stringify(["1725854616985-th.jpeg"]),
      category_id: 1,
      genre_id: JSON.stringify([1, 2]),
      user_id: 1,
      description:
        "This is the description for The Legend of Heroes: Trails in the Sky",
      clicked: 0,
    },
  ]);
};
