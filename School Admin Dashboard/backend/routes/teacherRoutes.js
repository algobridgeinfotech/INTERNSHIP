import express from "express";
import { body } from "express-validator";
import { createTeacher, deleteTeacher, getTeachers, markTeacherAttendance, updateTeacher } from "../controllers/teacherController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router
  .route("/")
  .get(getTeachers)
  .post(
    body("name").notEmpty().withMessage("Teacher name is required"),
    body("email").isEmail().withMessage("Valid teacher email is required"),
    body("subject").notEmpty().withMessage("Subject is required"),
    body("assignedClass").notEmpty().withMessage("Assigned class is required"),
    validate,
    createTeacher
  );

router.route("/:id").put(updateTeacher).delete(deleteTeacher);
router.post("/:id/attendance", body("date").isISO8601(), body("status").isIn(["Present", "Absent", "Late"]), validate, markTeacherAttendance);

export default router;
