import express from "express";
import {
  showProductGenres,
  createProductGenres,
} from "../../controllers/Products/productGenresController.js";

const router = express.Router();

router.post("/create", createProductGenres);
router.get("/show", showProductGenres);

export default router;
