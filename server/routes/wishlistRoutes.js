import exporess from "express";
import {
  createWishlist,
  deleteWishlist,
  fetchWishlist,
} from "../controllers/wishlistController.js";

const router = exporess.Router();

router.post("/create", createWishlist);
router.get("/:id", fetchWishlist);
router.delete("/delete/:userId/:productId", deleteWishlist);

export default router;
