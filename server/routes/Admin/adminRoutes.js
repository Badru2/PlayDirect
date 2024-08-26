import express from "express";
import {
  createAdmin,
  getAdmins,
  getIdByEmail,
} from "../../controllers/Admin/adminController.js";

const router = express.Router();

router.get("/get/admin", getAdmins);
router.post("/create/admin", createAdmin);
router.get("/get/admin/id", getIdByEmail);

export default router;
