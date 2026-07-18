import express from "express";
import authorizeAdmin from "../middlewares/admin.middleware.js"
import { createProduct, deleteProductById, getAllProduct, getProductById, updateProductById } from "../controllers/product.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validateId from "../middlewares/validateId.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, authorizeAdmin, createProduct);
router.get("/", getAllProduct);
router.get("/:id", validateId, getProductById);
router.put("/:id",authMiddleware, authorizeAdmin, validateId, updateProductById);
router.delete("/:id",authMiddleware, authorizeAdmin, validateId, deleteProductById);


export default router;
