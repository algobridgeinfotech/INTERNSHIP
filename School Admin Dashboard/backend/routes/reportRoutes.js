import express from "express";
import { exportStudentsCsv, getReportSummary } from "../controllers/reportController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get("/", getReportSummary);
router.get("/students.csv", exportStudentsCsv);

export default router;
