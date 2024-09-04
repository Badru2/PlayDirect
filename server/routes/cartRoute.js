import express from "express";
import {
  clearCart,
  createCart,
  deleteCart,
  editQuantity,
  getCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/add", createCart);
router.get("/show", getCart);
router.put("/update", editQuantity);
router.delete("/delete/:id", deleteCart);
router.post("/clear", clearCart);

export default router;
