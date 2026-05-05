import express from "express";
import { body } from "express-validator";
import { createExam, createResult, getExams, getResults, getResultsByStudent, setResultLock } from "../controllers/examController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.use(protect);

router.get("/exam", getExams);
router.post(
  "/exam",
  adminOnly,
  body("name").notEmpty().withMessage("Exam name is required"),
  body("className").notEmpty().withMessage("Class is required"),
  body("subjects").isArray({ min: 1 }).withMessage("At least one subject is required"),
  validate,
  createExam
);
router.patch("/exam/:examId/lock", adminOnly, setResultLock);

router.get("/result", getResults);
router.post(
  "/result",
  body("examId").notEmpty().withMessage("Exam is required"),
  body("studentId").notEmpty().withMessage("Student is required"),
  body("marks").isArray({ min: 1 }).withMessage("Marks are required"),
  validate,
  createResult
);
router.get("/results/:studentId", getResultsByStudent);

export default router;
