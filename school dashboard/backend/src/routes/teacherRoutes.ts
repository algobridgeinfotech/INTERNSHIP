import express from "express";
import { protect, authorize } from "../middlewares/authMiddleware";
import { 
  getTeacherDashboard, 
  getAssignedMetadata,
  clockIn, 
  clockOut, 
  getAssignedStudents,
  markStudentAttendance,
  createHomework,
  getHomeworkSubmissions,
  enterMarks
} from "../controllers/teacherController";

const router = express.Router();

router.use(protect);
router.use(authorize("TEACHER", "SUPER_ADMIN"));

// Dashboard & Metadata
router.get("/dashboard", getTeacherDashboard);
router.get("/metadata", getAssignedMetadata);

// Self Attendance
router.post("/attendance/clock-in", clockIn);
router.post("/attendance/clock-out", clockOut);

// Student Management
router.get("/students", getAssignedStudents);
router.post("/students/attendance", markStudentAttendance);

// Homework
router.post("/homework", createHomework);
router.get("/homework/:homeworkId/submissions", getHomeworkSubmissions);

// Exams
router.post("/exams/marks", enterMarks);

export default router;
