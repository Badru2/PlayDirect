import exporess from "express";
import {
  createWishlist,
  deleteWishlist,
  fetchWishlist,
  getWishlist,
} from "../controllers/wishlistController.js";

const router = exporess.Router();

router.post("/create", createWishlist);
router.get("/show", getWishlist);
router.get("/:id", fetchWishlist);
router.delete("/delete/:userId/:productId", deleteWishlist);

export default router;
