import { Router } from "express";
import authController from "../controllers/AuthController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validateRefreshToken } from "../middlewares/validateRefreshToken.js";
import upload from "../config/multer.js";

const router = Router();

// Auth Routes
router.post("/signin", authController.signin);
router.post("/signup", authController.signup);
router.post(
  "/update-profile",
  authMiddleware,
  upload.single("image"),
  authController.updateProfile
);
router.get("/self", authMiddleware, authController.self);
router.get("/refresh-tokens", validateRefreshToken, authController.refreshTokens);
router.post("/logout", authMiddleware, authController.logout);

export default router;
