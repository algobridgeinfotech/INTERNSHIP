import express from "express";
import { body } from "express-validator";
import { bulkMarkAttendance, getAttendance, markAttendance, updateAttendance } from "../controllers/attendanceController.js";
import { adminOnly, protect, teacherOnly } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.use(protect);

router.get("/", getAttendance);
router.post(
  "/",
  teacherOnly,
  body("studentId").notEmpty().withMessage("Student is required"),
  body("date").isISO8601().withMessage("Valid date is required"),
  body("status").isIn(["Present", "Absent", "Late"]).withMessage("Invalid status"),
  validate,
  markAttendance
);
router.post("/bulk", teacherOnly, body("date").isISO8601(), body("records").isArray({ min: 1 }), validate, bulkMarkAttendance);
router.put("/:id", adminOnly, updateAttendance);

export default router;
