// models/ProductGenre.js
import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const ProductGenre = sequelize.define(
  "ProductGenre",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "products_genre",
    timestamps: false,
  }
);

export default ProductGenre;
