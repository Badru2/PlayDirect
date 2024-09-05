import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Wishlist = sequelize.define(
  "Wishlist",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    product_id: {
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
    tableName: "wishlist",
    timestamps: false,
  }
);

Wishlist.associate = (models) => {
  Wishlist.belongsTo(models.Product, { foreignKey: "product_id" });
  Wishlist.belongsTo(models.User, { foreignKey: "user_id" });
};

export default Wishlist;
