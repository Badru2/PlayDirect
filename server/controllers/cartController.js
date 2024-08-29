import Cart from "../models/Cart.js";
import date from "date-and-time";
import Product from "../models/Product.js";

const now = new Date();
const dateNow = date.format(now, "YYYY-MM-DD HH:mm:ss");

export const createCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;

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

// Get detail by ID
export const getDetailById = async (req, res) => {
  const { id } = req.params;

  try {
    const products = await Product.findAll(id, {
      order: ["created_at", "DESC"],
      attributes: ["id", "name", "price", "image", "created_at", "updated_at"],
    });

    if (!products) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ products });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// add quantity
export const editQuantity = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const updated = await Cart.update(
      { quantity: quantity, updated_at: dateNow },
      {
        where: { product_id: productId },
      }
    );

    if (updated === 0) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.json({ message: "Quantity updated successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};
