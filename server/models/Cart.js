import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Cart = sequelize.define(
  "Cart",
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
    tableName: "carts",
    timestamps: false,
  }
);

Cart.associate = (models) => {
  Cart.belongsTo(models.Product, { foreignKey: "product_id" });
  Cart.belongsTo(models.User, { foreignKey: "user_id" });
};

export default Cart;
