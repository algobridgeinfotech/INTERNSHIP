import express from "express";
import { body } from "express-validator";
import { createNotification, deleteNotification, getNotifications } from "../controllers/notificationController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getNotifications)
  .post(
    adminOnly,
    body("title").notEmpty().withMessage("Title is required"),
    body("message").notEmpty().withMessage("Message is required"),
    validate,
    createNotification
  );

router.delete("/:id", adminOnly, deleteNotification);

export default router;
