import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { addToWishList, deleteWishList, getWishListItems, removeWishListItem } from "../controllers/wishlist.controller.js";

const router = express.Router();

router.post("/", authMiddleware, addToWishList);
router.get("/", authMiddleware, getWishListItems);
router.delete("/", authMiddleware, deleteWishList);
router.delete("/:id", authMiddleware, removeWishListItem);

export default router;