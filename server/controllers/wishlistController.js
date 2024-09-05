import Product from "../models/Product.js";
import Wishlist from "../models/Wishlist.js";
import date from "date-and-time";

// Add item to wishlist
export const createWishlist = async (req, res) => {
  const { userId, productId } = req.body;
  const now = new Date();
  const dateNow = date.format(now, "YYYY-MM-DD HH:mm:ss");

  try {
    // Check if the item is already in the wishlist
    const existingItem = await Wishlist.findOne({
      where: { user_id: userId, product_id: productId },
    });

    if (existingItem) {
      return res.status(400).json({ error: "Item already in wishlist" });
    }

    // Create new wishlist entry
    await Wishlist.create({
      user_id: userId,
      product_id: productId,
      created_at: dateNow,
      updated_at: dateNow,
    });

    return res.status(201).json({ message: "Item added to wishlist" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Check if item is in the wishlist
export const checkWishlist = async (req, res) => {
  const { userId, productId } = req.params; // Added productId

  try {
    const existingItem = await Wishlist.findOne({
      where: { user_id: userId, product_id: productId },
    });

    return res.status(200).json({ inWishlist: !!existingItem });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const fetchWishlist = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch wishlist items for the specific user
    const wishlistItems = await Wishlist.findAll({
      where: { user_id: id },
      include: [
        { model: Product, attributes: ["id", "name", "price", "images"] },
      ],
    });

    // Extract product IDs from the wishlist items
    const productIds = wishlistItems.map((item) => item.product_id);

    res.status(200).json(productIds); // Return product IDs as an array
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Remove item from wishlist
export const deleteWishlist = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const item = await Wishlist.findOne({
      where: { user_id: userId, product_id: productId },
    });

    if (!item) {
      return res.status(404).json({ error: "Item not found in wishlist" });
    }

    await item.destroy();
    return res.status(200).json({ message: "Item deleted from wishlist" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
