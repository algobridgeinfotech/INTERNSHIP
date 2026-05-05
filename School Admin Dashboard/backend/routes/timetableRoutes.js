import express from "express";
import { body } from "express-validator";
import { createTimetableEntry, deleteTimetableEntry, getTimetable, updateTimetableEntry } from "../controllers/timetableController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getTimetable)
  .post(
    adminOnly,
    body("className").notEmpty().withMessage("Class is required"),
    body("day").notEmpty().withMessage("Day is required"),
    body("subject").notEmpty().withMessage("Subject is required"),
    body("teacher").notEmpty().withMessage("Teacher is required"),
    body("timeSlot").notEmpty().withMessage("Time slot is required"),
    validate,
    createTimetableEntry
  );

router.route("/:id").put(adminOnly, updateTimetableEntry).delete(adminOnly, deleteTimetableEntry);

export default router;
