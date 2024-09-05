import Cart from "../models/Cart.js";
import date from "date-and-time";
import Product from "../models/Product.js";
import { Op } from "sequelize";

export const createCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  const now = new Date();
  const dateNow = date.format(now, "YYYY-MM-DD HH:mm:ss");

  try {
    // Find existing cart item
    const existingItem = await Cart.findOne({
      where: { user_id: userId, product_id: productId },
    });

    if (existingItem) {
      // Update the quantity if the item is already in the cart
      await existingItem.update({
        quantity: existingItem.quantity + quantity,
        updated_at: dateNow,
      });
    } else {
      // Create a new cart item
      await Cart.create({
        user_id: userId,
        product_id: productId,
        quantity,
        created_at: dateNow,
        updated_at: dateNow,
      });
    }

    res.status(201).json({ message: "Cart item created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// get cart
export const getCart = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const cart = await Cart.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
      include: [
        {
          model: Product,
          attributes: ["id", "name", "price", "images"],
        },
      ],
    });

    if (cart.length === 0) {
      return res.status(200).json({ message: "Cart is empty", cart: [] });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Edit quantity
export const editQuantity = async (req, res) => {
  const { userId, productId, quantity } = req.body;

  const now = new Date();
  const dateNow = date.format(now, "YYYY-MM-DD HH:mm:ss");

  try {
    const updated = await Cart.update(
      { quantity, updated_at: dateNow },
      {
        where: {
          [Op.and]: [{ user_id: userId }, { product_id: productId }],
        },
      }
    );

    if (updated[0] === 0) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.json({ message: "Quantity updated successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete cart item
export const deleteCart = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Cart.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.json({ message: "Cart item deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const clearCart = async (req, res) => {
  const { user_id } = req.body;

  try {
    // Delete all cart items for the user
    await Cart.destroy({
      where: { user_id },
    });

    res.status(200).json({ message: "Cart cleared successfully." });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Failed to clear cart." });
  }
};
