import express from "express";
import { getStudents, getStudentById, createStudent, updateStudent, deleteStudent, bulkUploadStudents, getPersonalAttendance, getPersonalHomework } from "../controllers/studentController";
import { getStudentTransport } from "../controllers/transportController";
import upload from "../config/multer";

import { protect, authorizeRoles } from "../middlewares/authMiddleware";

import { UserRole, STAFF_ROLES } from "../utils/constants";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(authorizeRoles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, ...STAFF_ROLES, UserRole.PARENT), getStudents)
  .post(authorizeRoles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN), createStudent);

router.post("/bulk-upload", authorizeRoles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN), upload.single("file"), bulkUploadStudents);

router.get("/my/attendance", authorizeRoles(UserRole.STUDENT), getPersonalAttendance);
router.get("/my/homework", authorizeRoles(UserRole.STUDENT), getPersonalHomework);
router.get("/my/transport", authorizeRoles(UserRole.STUDENT), getStudentTransport);

router.route("/:id")
  .get(authorizeRoles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, ...STAFF_ROLES, UserRole.PARENT, UserRole.STUDENT), getStudentById)
  .put(authorizeRoles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN), updateStudent)
  .delete(authorizeRoles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN), deleteStudent);

export default router;
