import { DataTypes } from "sequelize";
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
    tableName: "transaction", // Changed to plural form
    timestamps: false,
  }
);

Transaction.associate = (models) => {
  Transaction.belongsTo(models.User, { foreignKey: "user_id" });
};

export default Transaction;
