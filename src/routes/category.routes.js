import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeAdmin from "../middlewares/admin.middleware.js";
import { createCategory, getAllCategory, getCategoryById } from "../controllers/category.controller.js";
import validateId from "../middlewares/validateId.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, authorizeAdmin, createCategory);
router.get("/", getAllCategory);
router.get("/:id", validateId, getCategoryById);

export default router;