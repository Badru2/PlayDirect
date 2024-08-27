import path from "path";
import pool from "../../db.js";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const createProducts = async (req, res) => {
  const { name, price, category_id, genre_id, user_id, description } = req.body;

  if (!name || !price || !category_id || !description) {
    return res.status(400).json({ error: "All fields are required" });
  }

  let imagePaths = [];
  if (req.files && req.files.images) {
    const images = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    for (const imageFile of images) {
      const targetDir = path.join(
        __dirname,
        "../../../client/public/images/products"
      );
      await fs.promises.mkdir(targetDir, { recursive: true });
      const date = Date.now();

      const imagePath = path.join(targetDir, `${date}-${imageFile.name}`);

      try {
        await imageFile.mv(imagePath);
        imagePaths.push(`${date}-${imageFile.name}`);
      } catch (error) {
        console.error("File upload error:", error.message);
        return res.status(500).json({ error: "File upload failed" });
      }
    }
  }

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
    console.error("Error creating product:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await pool.query("SELECT * FROM products");
    res.json(products.rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Server error" });
  }
};
