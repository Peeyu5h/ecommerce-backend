import express from "express";
import { getUser } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, getUser);

export default router;