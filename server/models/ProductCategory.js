// models/ProductCategory.js
import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const ProductCategory = sequelize.define(
  "ProductCategory",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "products_category",
    timestamps: false,
  }
);

export default ProductCategory;
