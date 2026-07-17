import express from "express";
import authorizeAdmin from "../middlewares/admin.middleware.js"
import { createProduct, getAllProduct, getProductById } from "../controllers/product.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/products", authMiddleware, authorizeAdmin, createProduct);
router.get("/products", getAllProduct);
router.get("/products/:id", getProductById);


export default router;
