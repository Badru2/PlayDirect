import express from "express";
import date from "date-and-time";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import Product from "../models/Product.js";

dotenv.config({ path: "../.env" });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow cross-origin requests (adjust as needed)
  },
});

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Emit transaction update event from the backend
export const createTransaction = async (req, res) => {
  const { user_id, total_price, products } = req.body;

  const now = new Date();
  const dateNow = date.format(now, "YYYY-MM-DD HH:mm:ss");

  if (!user_id || !total_price || !products) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newTransaction = await Transaction.create({
      user_id,
      total_price,
      products,
      status: "pending",
      created_at: dateNow,
      updated_at: dateNow,
    });

    // update product stock
    for (const product of products) {
      const stock = await Product.findByPk(product.product_id);
      if (stock) {
        const newStock = stock.stock - product.quantity;
        await stock.update({ stock: newStock });
      }
    }

    // Emit event to notify all clients about the new transaction
    io.emit("transactionCreated", newTransaction);

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [{ model: User, attributes: ["username", "email"] }],
    });
    res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateTransactions = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const now = new Date();
  const dateNow = date.format(now, "YYYY-MM-DD HH:mm:ss");

  try {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    transaction.status = status;
    transaction.updated_at = dateNow;
    await transaction.save();

    // update product stock
    if (status === "cancelled") {
      for (const product of transaction.products) {
        const stock = await Product.findByPk(product.product_id);
        if (stock) {
          const newStock = stock.stock + product.quantity;
          await stock.update({ stock: newStock });
        }
      }
    }

    // Emit event to notify all clients about the updated transaction
    io.emit("transactionUpdated", transaction);

    res.status(200).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Starting the server with Socket.IO
const PORT = process.env.VITE_SOCKET_PORT;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
