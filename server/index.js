import dotenv from "dotenv";
import pkg from "pg";
import bcrypt from "bcryptjs";
import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import cors from "cors";

const app = express();
const { Pool } = pkg;
dotenv.config({ path: "../.env" });

const pool = new Pool({
  host: process.env.SERVER_HOST,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    origin: `http://${process.env.SERVER_HOST}:${process.env.CLIENT_PORT}`,
    credentials: true,
  })
);

app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Check if any value is undefined
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

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: "invalid token" });
  }
};

const verifyTokenAndRole = (allowedRoles) => {
  return async (req, res, next) => {
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

      const currentRole = user.rows[0].role;

      if (!allowedRoles.includes(currentRole)) {
        return res.status(403).json({ error: "Access denied: Role mismacth" });
      }

      next();
    } catch (error) {
      console.error("Token verification error: ", error.message);
      res.status(401).json({ error: "Unauthorized access" });
    }
  };
};

app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route" });
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `Server running on port http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`
  );
});
