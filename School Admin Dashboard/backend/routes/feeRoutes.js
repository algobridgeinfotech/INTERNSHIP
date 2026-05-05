import express from "express";
import { body } from "express-validator";
import { createFee, downloadReceipt, getFees, updateFee } from "../controllers/feeController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get("/", getFees);
router.post(
  "/",
  body("studentId").notEmpty().withMessage("Student is required"),
  body("title").notEmpty().withMessage("Fee title is required"),
  body("amount").isFloat({ min: 0 }).withMessage("Amount must be positive"),
  body("dueDate").isISO8601().withMessage("Due date is required"),
  validate,
  createFee
);
router.put("/:id", updateFee);
router.get("/:id/receipt", downloadReceipt);

export default router;
