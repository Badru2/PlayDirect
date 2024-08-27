import express from "express";
import {
  createProducts,
  getProducts,
} from "../../controllers/Products/productController.js";

const router = express.Router();

router.post("/create", createProducts);
router.get("/show", getProducts);

export default router;
