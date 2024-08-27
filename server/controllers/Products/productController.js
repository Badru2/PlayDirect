import path from "path";
import pool from "../../db.js";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const createProducts = async (req, res) => {
  const { name, price, category_id, genre_id, user_id, description } = req.body;

  // Validate that all required fields are provided
  if (
    !name ||
    !price ||
    !category_id ||
    !genre_id ||
    !user_id ||
    !description
  ) {
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
        JSON.stringify(genre_id), // Directly insert genre_id
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

const getProductWithGenres = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.images,
        p.category_id,
        p.user_id,
        p.created_at,
        p.updated_at,
        json_agg(json_build_object('id', g.id, 'name', g.name)) AS genres
      FROM 
        products p
      JOIN 
        product_genres pg ON p.id = pg.product_id
      JOIN 
        genres g ON g.id = pg.genre_id
      WHERE 
        p.id = $1
      GROUP BY 
        p.id;
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    res.json(product.rows[0]);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Server error" });
  }
};
