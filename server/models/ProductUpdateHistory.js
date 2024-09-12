import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const ProductUpdateHistory = sequelize.define(
  "ProductUpdateHistory",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    old_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    new_stock: {
      type: DataTypes.INTEGER,
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
    tableName: "products_update_stock_history",
    timestamps: false,
  }
);

export default ProductUpdateHistory;
