import express from "express";
import { protect } from "../middlewares/authMiddleware";
import { getMyNotifications } from "../controllers/notificationController";

const router = express.Router();

router.use(protect);

router.get("/", getMyNotifications);

export default router;
