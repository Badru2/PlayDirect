import express from "express";
import {
  createProductCategories,
  showProductCategories,
} from "../../controllers/Products/productCategoriesController.js";

const router = express.Router();

router.post("/create", createProductCategories);
router.get("/show", showProductCategories);

export default router;
