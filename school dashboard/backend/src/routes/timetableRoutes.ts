import express from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware";
import { 
    getTimetables, 
    upsertTimetable, 
    approveTimetable,
    getTeacherTimetable,
    getStudentTimetable
} from "../controllers/timetableController";

import { UserRole } from "../utils/constants";

const router = express.Router();

router.use(protect);

// Admin/Controller routes
router.get("/", authorizeRoles(UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_CONTROLLER, UserRole.SUPER_ADMIN), getTimetables);
router.post("/", authorizeRoles(UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_CONTROLLER, UserRole.SUPER_ADMIN), upsertTimetable);
router.patch("/:id/approve", authorizeRoles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN), approveTimetable);

// Specific role views
router.get("/my-schedule", authorizeRoles(UserRole.TEACHER, UserRole.SUPER_ADMIN), getTeacherTimetable);
router.get("/student-schedule", authorizeRoles(UserRole.STUDENT, UserRole.PARENT, UserRole.SUPER_ADMIN), getStudentTimetable);

export default router;
