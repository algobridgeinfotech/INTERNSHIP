import express from "express";
import { body } from "express-validator";
import {
  bulkUploadStudents,
  createStudent,
  deleteStudent,
  getStudentById,
  getStudents,
  updateStudent,
  uploadStudentDocument
} from "../controllers/studentController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getStudents)
  .post(
    adminOnly,
    upload.single("photo"),
    body("name").notEmpty().withMessage("Name is required"),
    body("rollNumber").notEmpty().withMessage("Roll number is required"),
    body("className").notEmpty().withMessage("Class is required"),
    body("section").notEmpty().withMessage("Section is required"),
    validate,
    createStudent
  );

router.post("/bulk", adminOnly, upload.single("file"), bulkUploadStudents);
router.post("/:id/documents", adminOnly, upload.single("document"), uploadStudentDocument);

router
  .route("/:id")
  .get(getStudentById)
  .put(adminOnly, upload.single("photo"), updateStudent)
  .delete(adminOnly, deleteStudent);

export default router;
