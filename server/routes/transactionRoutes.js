import express from "express";
import {
  createTransaction,
  getTransactions,
  updateTransactions,
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/create", createTransaction);
router.get("/show", getTransactions);
router.put("/update/:id", updateTransactions);

export default router;
