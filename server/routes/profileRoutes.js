import express from "express";
import path from "path"; // Import path to handle file extensions
import { getProfile, updateProfile } from "../controllers/ProfileController.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.dirname(__dirname) + "/public/images/avatar/"); // Define destination for avatar images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Create unique file name with extension
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

const router = express.Router();

router.get("/show", getProfile);
router.put("/update/:id", upload.single("avatar"), updateProfile);

export default router;
