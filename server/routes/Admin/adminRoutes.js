import express from "express";
import {
  createAdmin,
  deleteAdmin,
  editAdmin,
  getAdmins,
  getIdByEmail,
  getUsernameById,
} from "../../controllers/Admin/adminController.js";

const router = express.Router();

router.get("/show", getAdmins);
router.post("/create", createAdmin);
router.get("/get/:id", getIdByEmail);
router.put("/edit/:id", editAdmin);
router.delete("/delete/:id", deleteAdmin);
router.get("/getUsername/:id", getUsernameById);

export default router;
