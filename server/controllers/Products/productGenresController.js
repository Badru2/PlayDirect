import pool from "../../db.js";

export const createProductGenres = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newGenre = await pool.query(
      "INSERT INTO products_genre (name) VALUES ($1) RETURNING *",
      [name]
    );

    res.status(201).json({
      message: "Product genre created successfully",
      genre: newGenre.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const showProductGenres = async (req, res) => {
  try {
    const genres = await pool.query(
      "SELECT * FROM products_genre ORDER BY name ASC"
    );
    res.json(genres.rows);
  } catch (error) {
    console.error(error);
  }
};
