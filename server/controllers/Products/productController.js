import path from "path";
import pool from "../../db.js"; // Assuming you have a db.js file for database connection

export const createProducts = async (req, res) => {
  const { name, price, category_id, genre_id, user_id, description } = req.body;

  // Validate required fields
  if (!name || !price || !category_id || !description) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Handle multiple image uploads
  let imagePaths = [];
  if (req.files && req.files.images) {
    const images = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    for (const imageFile of images) {
      const imagePath = path.join(
        "uploads/products-image",
        `${Date.now()}-${imageFile.name}`
      );

      try {
        await imageFile.mv(imagePath);
        imagePaths.push(imagePath);
      } catch (error) {
        console.error("File upload error:", error.message);
        return res.status(500).json({ error: "File upload failed" });
      }
    }
  }

  // Insert product into database
  try {
    const newProduct = await pool.query(
      `INSERT INTO products (name, price, images, category_id, genre_id, user_id, description, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *`,
      [
        name,
        price,
        JSON.stringify(imagePaths),
        category_id,
        genre_id || null,
        user_id,
        description,
      ]
    );

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct.rows[0],
    });
  } catch (error) {
    console.error("Error creating product:", error.message, {
      name,
      price,
      category_id,
      genre_id,
      user_id,
      description,
      imagePaths,
    });
    res.status(500).json({ error: "Server error" });
  }
};
