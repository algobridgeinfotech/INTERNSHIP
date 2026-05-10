import express from "express";
import { getGlobalAnalytics } from "../controllers/analyticsController";
import { protect, authorize } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(protect);
router.use(authorize("SUPER_ADMIN")); 

router.route("/global").get(getGlobalAnalytics);

export default router;
