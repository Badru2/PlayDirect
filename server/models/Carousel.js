import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Carousel = sequelize.define(
  "Carousel",
  {
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "carousel",
    timestamps: false,
  }
);

export default Carousel;
