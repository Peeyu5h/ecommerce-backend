import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { addToWishList, deleteWishList, getWishListItems, moveAllToCart, removeWishListItem } from "../controllers/wishlist.controller.js";

const router = express.Router();

router.post("/", authMiddleware, addToWishList);
router.get("/", authMiddleware, getWishListItems);
router.delete("/", authMiddleware, deleteWishList);
router.delete("/:id", authMiddleware, removeWishListItem);
router.post("/move-to-cart", authMiddleware, moveAllToCart);

export default router;