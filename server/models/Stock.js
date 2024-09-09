import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import Product from "./Product.js";

const Stock = sequelize.define(
  "Stock",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
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
    tableName: "product_stock",
    timestamps: false,
  }
);

// Product.hasMany(Stock, { foreignKey: "product_id" });

Stock.associate = (models) => {
  Stock.belongsTo(models.Product, { foreignKey: "product_id" });
};

export default Stock;
