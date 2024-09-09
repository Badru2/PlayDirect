import path from "path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs";
import Product from "../../models/Product.js";
import date from "date-and-time";
import Stock from "../../models/Stock.js";
import ProductCategory from "../../models/ProductCategory.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const createProducts = async (req, res) => {
  const { name, price, category_id, genre_id, user_id, description, stock } =
    req.body;
  const now = new Date();
  const dateNow = date.format(now, "YYYY-MM-DD HH:mm:ss");

  if (!name || !price || !category_id || !user_id || !description || !stock) {
    return res.status(400).json({ error: "All fields are required" });
  }

  let imagePaths = [];
  if (req.files && req.files.images) {
    const images = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    const targetDir = path.join(
      __dirname,
      "../../../client/public/images/products"
    );

    try {
      await fs.promises.mkdir(targetDir, { recursive: true });

      for (const imageFile of images) {
        const dateNow = Date.now();
        const imagePath = path.join(targetDir, `${dateNow}-${imageFile.name}`);

        try {
          await imageFile.mv(imagePath);
          imagePaths.push(`${dateNow}-${imageFile.name}`);
        } catch (error) {
          console.error("File upload error:", error.message);
          return res.status(500).json({ error: "File upload failed" });
        }
      }
    } catch (mkdirError) {
      console.error("Directory creation error:", mkdirError.message);
      return res
        .status(500)
        .json({ error: "Failed to create directory for uploads" });
    }
  }

  try {
    const newProduct = await Product.create({
      name,
      price,
      images: imagePaths,
      category_id,
      genre_id: genre_id || null,
      user_id,
      description,
      created_at: dateNow,
      updated_at: dateNow,
    });

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });

    if (newProduct) {
      await Stock.create({
        user_id: newProduct.user_id,
        product_id: newProduct.id,
        quantity: stock,
        created_at: dateNow,
        updated_at: dateNow,
      });

      console.log("Stock created successfully");
    }
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      // include: [
      //   {
      //     model: ProductCategory,
      //     attributes: ["name"],
      //   },
      // ],
    });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await product.destroy();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id, {});

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
