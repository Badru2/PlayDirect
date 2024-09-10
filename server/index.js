import express from "express";

import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

import authRoutes from "./routes/authRoute.js";
import adminRoutes from "./routes/Admin/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import productRoutes from "./routes/Products/productRoutes.js";
import productGenreRoutes from "./routes/Products/productGenresRoutes.js";
import productCategoryRoutes from "./routes/Products/productCategoriesRoutes.js";
import productStocksRoutes from "./routes/Products/productStocksRoutes.js";

import cartRoute from "./routes/cartRoute.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";

import authenticateToken from "./middleware/authenticateToken.js";

dotenv.config({ path: "../.env" });

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    origin: `http://${process.env.SERVER_HOST}:${process.env.CLIENT_PORT}`,
    credentials: true,
  })
);

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use("/images", express.static(path.join(__dirname, "images")));

// Login and register
app.use("/api", authRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

// products routes
app.use("/api/product", productRoutes);
app.use("/api/product-genres", productGenreRoutes);
app.use("/api/product-categories", productCategoryRoutes);
app.use("/api/product-stocks", productStocksRoutes);

app.use("/api/cart", cartRoute);
app.use("/api/transaction", transactionRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);

// Protected route
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route" });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Page not found" });
});

// Server setup
app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `Server running on port http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`
  );
});
