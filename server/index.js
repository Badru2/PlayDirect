import dotenv from "dotenv";
import pkg from "pg";
import bcrypt from "bcryptjs";
import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import cors from "cors";
import fileUpload from "express-fileupload";
import path from "path";

dotenv.config({ path: "../.env" });

// Ensure required environment variables are present
if (
  !process.env.SERVER_HOST ||
  !process.env.PG_DATABASE ||
  !process.env.JWT_SECRET
) {
  throw new Error("Missing required environment variables");
}

const app = express();
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.SERVER_HOST,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

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
    createParentPath: true, // Ensure upload directories are created automatically
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  })
);

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};

const verifyTokenAndRole = (allowedRoles) => async (req, res, next) => {
  try {
    const token = req.header("Authorization").split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;

    const user = await pool.query("SELECT role FROM users WHERE id = $1", [
      req.user.id,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!allowedRoles.includes(user.rows[0].role)) {
      return res.status(403).json({ error: "Access denied: Role mismatch" });
    }

    next();
  } catch (error) {
    console.error("Token verification error: ", error.message);
    res.status(401).json({ error: "Unauthorized access" });
  }
};

// Routes
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, hashedPassword, "user"]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: newUser.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      role: user.rows[0].role,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/user/getIdByEmail", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const result = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = result.rows[0].id;
    res.json({ id: userId });
  } catch (error) {
    console.error("Error fetching user ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/create/admin", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, hashedPassword, "admin"]
    );

    res.status(201).json({
      message: "Admin registered successfully",
      admin: newAdmin.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/show/admin", async (req, res) => {
  try {
    const admins = await pool.query("SELECT * FROM users WHERE role = $1", [
      "admin",
    ]);

    res.json(admins.rows);
  } catch (error) {
    console.error(error);
  }
});

app.post("/api/create/product-category", async (req, res) => {
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
});

app.get("/api/get/product-category", async (req, res) => {
  try {
    const categories = await pool.query(
      "SELECT * FROM products_category ORDER BY name ASC"
    );
    res.json(categories.rows);
  } catch (error) {
    console.error(error);
  }
});

app.post("/api/create/product-genre", async (req, res) => {
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
});

app.get("/api/get/product-genre", async (req, res) => {
  try {
    const genres = await pool.query(
      "SELECT * FROM products_genre ORDER BY name ASC"
    );
    res.json(genres.rows);
  } catch (error) {
    console.error(error);
  }
});

app.post("/api/create/product", async (req, res) => {
  const { name, price, category_id, genre_id, user_id, description } = req.body;

  if (!name || !price || !category_id || !description) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Handle image upload
  let imagePath = null;
  if (req.files && req.files.image) {
    const imageFile = req.files.image;
    imagePath = path.join(
      "uploads/products-image",
      Date.now() + path.extname(imageFile.name)
    );
    try {
      await imageFile.mv(imagePath);
    } catch (error) {
      console.error("File upload error:", error.message);
      return res.status(500).json({ error: "File upload failed" });
    }
  }

  try {
    const newProduct = await pool.query(
      "INSERT INTO products (name, price, image, category_id, genre_id, user_id, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [name, price, imagePath, category_id, genre_id || null, 1, description]
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
      imagePath,
    });
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route" });
});

// Server setup
app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `Server running on port http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`
  );
});
