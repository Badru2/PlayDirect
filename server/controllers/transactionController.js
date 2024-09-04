import date from "date-and-time";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

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

    res.status(200).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
