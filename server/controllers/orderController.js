import Transaction from "../models/Transaction.js";

export const detailOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Transaction.findOne({ where: { id } }); // Sequelize query
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
