import pool from "../../db.js";

export const createProductCategories = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newCategory = await pool.query(
      "INSERT INTO products_category (name) VALUES ($1) RETURNING *",
      [name]
    );

    res.status(201).json({
      message: "Product category created successfully",
      category: newCategory.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const showProductCategories = async (req, res) => {
  try {
    const categories = await pool.query(
      "SELECT * FROM products_category ORDER BY name ASC"
    );
    res.json(categories.rows);
  } catch (error) {
    console.error(error);
  }
};
