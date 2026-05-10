import express from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware";
import { getDashboardStats } from "../controllers/dashboardController";
import { markAttendance, getAttendanceReport } from "../controllers/attendanceController";
import { getExams, createExam, updateExamStatus } from "../controllers/examController";
import { getFees, collectFee } from "../controllers/feeController";
import { getTransport, createTransport } from "../controllers/transportController";
import { getNotifications, sendNotification } from "../controllers/notificationController";
import { getTimetables, upsertTimetable } from "../controllers/timetableController";

import { UserRole } from "../utils/constants";
import { updateTransport, deleteTransport, assignStudentToTransport } from "../controllers/transportController";

const router = express.Router();

router.use(protect);
router.use(authorizeRoles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN));

// Dashboard
router.get("/dashboard/stats", getDashboardStats);

// Attendance
router.post("/attendance/mark", markAttendance);
router.get("/attendance/report", getAttendanceReport);

// Exams
router.get("/exams", getExams);
router.post("/exams", createExam);
router.patch("/exams/:id/status", updateExamStatus);

// Fees
router.get("/fees", getFees);
router.post("/fees/:id/collect", collectFee);

// Transport
router.get("/transport", getTransport);
router.post("/transport", createTransport);
router.put("/transport/:id", updateTransport);
router.delete("/transport/:id", deleteTransport);
router.post("/transport/assign", assignStudentToTransport);

// Notifications
router.get("/notifications", getNotifications);
router.post("/notifications", sendNotification);

// Timetable
router.get("/timetable", getTimetables);
router.post("/timetable", upsertTimetable);

export default router;
