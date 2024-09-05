import express from "express";
import {
  createProducts,
  getProducts,
  getProductById,
  deleteProduct,
} from "../../controllers/Products/productController.js";

const router = express.Router();

router.post("/create", createProducts);
router.get("/show", getProducts);
router.get("/:id", getProductById);
router.delete("/delete/:id", deleteProduct);

export default router;
