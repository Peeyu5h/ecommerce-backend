import express from "express";
import { addToCart, removeCartItem, getCartItem, deleteCartItems, updateCartItems } from "../controllers/cart.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, addToCart);
router.get("/", authMiddleware, getCartItem);
router.delete("/", authMiddleware, deleteCartItems);
router.delete("/:id", authMiddleware, removeCartItem);
router.put("/:id", authMiddleware, updateCartItems);

export default router;