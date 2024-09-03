// models/Transaction.js
import { DataTypes } from "sequelize";
import User from "./User.js";
import sequelize from "../db.js";

const Transaction = sequelize.define(
  "Transaction",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    products: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "transaction",
    timestamps: false,
  }
);

Transaction.belongsTo(User, { foreignKey: "user_id" });

export default Transaction;
