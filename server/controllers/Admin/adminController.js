import bcrypt from "bcryptjs";
import pool from "../../db.js";

// Create new admin on super admin
export const createAdmin = async (req, res) => {
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
};

// Get all admins
export const getAdmins = async (req, res) => {
  try {
    const admins = await pool.query("SELECT * FROM users WHERE role = $1", [
      "admin",
    ]);

    res.json(admins.rows);
  } catch (error) {
    console.error(error);
  }
};

// Get user ID by email
export const getIdByEmail = async (req, res) => {
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
};
