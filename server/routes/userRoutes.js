import express from "express";
import { getUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/show", getUsers);

export default router;
