import User from "../models/User.js";

export const getProfile = async (req, res) => {
  const { email } = req.query; // Email passed as query param

  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { username, email, phone, address } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update only the fields that are present in the request
    if (username) user.username = username;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    // Handle avatar file upload (if any)
    if (req.file) {
      user.avatar = `/images/avatar/${req.file.filename}`; // Set the file path
    }

    await user.save(); // Sequelize will handle updatedAt automatically

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};
