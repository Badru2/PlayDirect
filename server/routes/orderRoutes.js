import express from "express";
import { detailOrder } from "../controllers/orderController.js";
const router = express.Router();

router.get("/:id", detailOrder);

export default router;
