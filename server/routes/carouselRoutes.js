import express from "express";
import {
  createCarousel,
  getCarousel,
} from "../controllers/carouselController.js";

const router = express.Router();

router.post("/create", createCarousel);
router.get("/show", getCarousel);

export default router;
