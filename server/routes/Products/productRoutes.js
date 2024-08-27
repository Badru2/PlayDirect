import express from "express";
import {
  createProducts,
  getProducts,
  getProductById,
} from "../../controllers/Products/productController.js";

const router = express.Router();

router.post("/create", createProducts);
router.get("/show", getProducts);
router.get("/:id", getProductById);

export default router;
