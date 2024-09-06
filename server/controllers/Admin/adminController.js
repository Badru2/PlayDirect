import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import date from "date-and-time";
import validator from "validator";

const now = new Date();
const dateNow = date.format(now, "YYYY-MM-DD HH:mm:ss");

export const createAdmin = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    return res.status(400).json({ error: "Username already in use" });
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Validate password strength
  // if (!validator.isStrongPassword(password)) {
  //   return res.status(400).json({
  //     error:
  //       "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one symbol",
  //   });
  // }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "admin",
      created_at: dateNow,
      updated_at: dateNow,
    });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: newAdmin,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all admins
export const getAdmins = async (req, res) => {
  try {
    const admins = await User.findAll({
      where: { role: "admin" },
    });

    res.json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Edit admin
export const editAdmin = async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [updated] = await User.update(
      {
        username,
        email,
        password: hashedPassword,
        updated_at: dateNow,
      },
      {
        where: { id },
      }
    );

    if (updated === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.json({ message: "Admin updated successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete admin
export const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await User.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get user ID by email
export const getIdByEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await User.findOne({
      where: { email },
      attributes: ["id"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ id: user.id });
  } catch (error) {
    console.error("Error fetching user ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get username by ID
export const getUsernameById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      attributes: ["username"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ username: user.username });
  } catch (error) {
    console.error("Error fetching username:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
