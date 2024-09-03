// models/Product.js
import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import Cart from "./Cart.js";

const Product = sequelize.define(
  "Product",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    images: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    genre_id: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
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
    tableName: "products",
    timestamps: false, // Disable automatic createdAt and updatedAt columns
  }
);

Cart.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(Cart, { foreignKey: "product_id" });

export default Product;
