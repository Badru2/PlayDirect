// models/Product.js
import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import Cart from "./Cart.js";
import Wishlist from "./Wishlist.js";
import Stock from "./Stock.js";
import ProductCategory from "./ProductCategory.js";

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
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    clicked: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
Wishlist.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(Cart, { foreignKey: "product_id" });
Stock.belongsTo(Product, { foreignKey: "product_id" });
ProductCategory.hasMany(Product, { foreignKey: "category_id" });

export default Product;
