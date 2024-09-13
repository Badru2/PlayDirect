import express from "express";
import {
  createProducts,
  getProducts,
  getProductById,
  deleteProduct,
  getRelatedProducts,
  updateProduct,
  getHistoryProduct,
} from "../../controllers/Products/productController.js";

const router = express.Router();

router.post("/create", createProducts);
router.get("/show", getProducts);
router.get("/show/history", getHistoryProduct);
router.get("/:id", getProductById);
router.get("/related/:category_id", getRelatedProducts);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

export default router;
