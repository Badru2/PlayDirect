import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

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

export default verifyTokenAndRole;
