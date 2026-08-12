import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createReview, deleteReview, getProductReviews, updateReview } from "../controllers/user-reveiw.controller.js";

const router = express.Router();

router.post("/:id", authMiddleware, createReview);
router.get("/product/:id", getProductReviews);
router.put("/:reviewId", authMiddleware, updateReview);
router.delete("/:reviewId", authMiddleware, deleteReview);

export default router;