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

import productRoutes from "./routes/Products/productRoutes.js";
import productGenreRoutes from "./routes/Products/productGenresRoutes.js";
import productCategoryRoutes from "./routes/Products/productCategoriesRoutes.js";

import cartRoute from "./routes/cartRoute.js";

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

// products routes
app.use("/api/product", productRoutes);
app.use("/api/product-genres", productGenreRoutes);
app.use("/api/product-categories", productCategoryRoutes);

app.use("/api/cart", cartRoute);

// Protected route
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route" });
});

// Server setup
app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `Server running on port http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`
  );
});
