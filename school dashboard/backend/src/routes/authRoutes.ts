import express from "express";
import { loginUser, logoutUser, getMe, setupPassword, refreshToken, forgotPassword } from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/setup-password", protect, setupPassword);
router.get("/me", protect, getMe);

export default router;
