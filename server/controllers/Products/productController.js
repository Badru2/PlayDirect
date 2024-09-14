import path from "path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs";
import Product from "../../models/Product.js";
import date from "date-and-time";
import Stock from "../../models/Stock.js";
import ProductCategory from "../../models/ProductCategory.js";
import User from "../../models/User.js";
import ProductGenre from "../../models/ProductGenre.js";
import ProductUpdateHistory from "../../models/ProductUpdateHistory.js";
import { Op } from "sequelize";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const createProducts = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    const { name, price, category_id, genre_id, user_id, description, stock } =
      req.body;
    const now = new Date();
    const dateNow = date.format(now, "YYYY-MM-DD HH:mm:ss");

    // Validate required fields
    if (!name || !price || !category_id || !user_id || !description || !stock) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Parse numeric fields
    const parsedPrice = parseFloat(price);
    const parsedCategoryId = parseInt(category_id, 10);
    const parsedUserId = parseInt(user_id, 10);
    const parsedStock = parseInt(stock, 10);

    if (
      isNaN(parsedPrice) ||
      isNaN(parsedCategoryId) ||
      isNaN(parsedUserId) ||
      isNaN(parsedStock)
    ) {
      return res.status(400).json({ error: "Invalid numeric fields" });
    }

    // Validate foreign keys
    const category = await ProductCategory.findByPk(parsedCategoryId);
    if (!category) {
      return res.status(400).json({ error: "Invalid category_id" });
    }

    const user = await User.findByPk(parsedUserId);
    if (!user) {
      return res.status(400).json({ error: "Invalid user_id" });
    }

    // Handle genre_ids
    let genreIds = [];
    if (genre_id) {
      if (Array.isArray(genre_id)) {
        genreIds = genre_id
          .map((id) => parseInt(id, 10))
          .filter((id) => !isNaN(id));
      } else if (typeof genre_id === "string") {
        const parsedId = parseInt(genre_id, 10);
        if (!isNaN(parsedId)) genreIds = [parsedId];
      }
    }

    if (genreIds.length > 0) {
      const genres = await ProductGenre.findAll({ where: { id: genreIds } });
      if (genres.length !== genreIds.length) {
        return res
          .status(400)
          .json({ error: "One or more genre_ids are invalid" });
      }
    }

    // Handle file uploads
    let imagePaths = [];
    if (req.files && req.files.images) {
      const images = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      // Define target directory
      const targetDir = path.join(__dirname, "../../public/images/products");

      try {
        // Ensure directory exists
        await fs.promises.mkdir(targetDir, { recursive: true });

        // Process each image file
        for (const imageFile of images) {
          const timestamp = Date.now();
          const imageFileName = `${timestamp}-${imageFile.name}`;
          const imagePath = path.join(targetDir, imageFileName);

          try {
            // Move the file
            await imageFile.mv(imagePath);
            // Store relative path
            imagePaths.push(`${imageFileName}`);
          } catch (error) {
            console.error("File upload error:", error.message);
            // Cleanup uploaded files
            imagePaths.forEach((path) => {
              fs.unlink(path, (err) => {
                if (err) console.error("Error deleting file:", path, err);
              });
            });
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
      // Create the product without genre_id
      const newProduct = await Product.create({
        name,
        price: parsedPrice,
        images: imagePaths,
        category_id: parsedCategoryId,
        user_id: parsedUserId,
        description,
        stock: parsedStock,
        created_at: dateNow,
        updated_at: dateNow,
      });

      // Associate genres if any
      if (genreIds.length > 0) {
        await newProduct.setGenres(genreIds);
      }

      res.status(201).json({
        message: "Product created successfully",
        product: newProduct,
      });

      console.log("Stock created successfully");
    } catch (error) {
      console.error("Error creating product:", error);
      if (error.name === "SequelizeValidationError") {
        const messages = error.errors.map((err) => err.message);
        return res.status(400).json({ error: messages });
      }
      res.status(500).json({ error: "Server error" });
    }
  } catch (outerError) {
    console.error("Unexpected error:", outerError);
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

export const getHistoryProduct = async (req, res) => {
  try {
    const products = await ProductUpdateHistory.findAll({
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Product,
          attributes: [
            "id",
            "name",
            "price",
            "images",
            "category_id",
            "user_id",
            "genre_id",
            "description",
            "stock",
            "created_at",
            "updated_at",
          ],
        },
      ],
    });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Error fetching products" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, category_id, user_id, genre_id, description, stock } =
    req.body;

  const now = new Date();
  const dateNow = date.format(now, "YYYY-MM-DD HH:mm:ss");
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // save history
    await ProductUpdateHistory.create({
      user_id: user_id,
      product_id: id,
      old_stock: product.stock,
      new_stock: stock,
      created_at: dateNow,
    });

    product.name = name || product.name;
    product.price = price || product.price;
    product.category_id = category_id || product.category_id;
    product.genre_id = genre_id || product.genre_id;
    product.description = description || product.description;
    product.stock = stock || product.stock;
    product.updated_at = new Date();

    await product.save();

    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error.message);
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

    // Delete associated stock
    await Stock.destroy({ where: { product_id: id } });

    await product.destroy();
    res.json({ message: "Product and associated stock deleted successfully" });
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

export const getRelatedProducts = async (req, res) => {
  const { category_id } = req.params;
  try {
    const relatedProducts = await Product.findAll({
      where: { category_id },
      limit: 15,
    });
    res.json(relatedProducts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch related products" });
  }
};

export const getProductByName = async (req, res) => {
  const { productName } = req.query;

  if (!productName) {
    return res.status(400).json({ error: "Product name is required" });
  }

  try {
    const products = await Product.findAll({
      where: {
        name: { [Op.iLike]: `%${productName}%` }, // Matching the product name
      },
    });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
