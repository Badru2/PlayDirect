import express from "express";
import { getProfile, updateProfile } from "../controllers/ProfileController.js";

const router = express.Router();

router.get("/show", getProfile);
router.put("/update/:id", updateProfile);

export default router;
