import express from "express";
import {
  CreateStock,
  getStocks,
} from "../../controllers/Products/productStocksController.js";

const router = express.Router();

router.post("/create", CreateStock);
router.get("/show", getStocks);

export default router;
