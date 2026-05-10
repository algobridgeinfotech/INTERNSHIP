import express from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware";
import { getStudentTransport } from "../controllers/transportController";
import { getPersonalAttendance, getPersonalHomework } from "../controllers/studentController";
import { UserRole } from "../utils/constants";
import Student from "../models/Student";
import Attendance from "../models/Attendance";
import Fee from "../models/Fee";
import Timetable from "../models/Timetable";

const router = express.Router();

router.use(protect);
router.use(authorizeRoles(UserRole.PARENT, UserRole.SUPER_ADMIN));

// Get list of children for the logged-in parent
router.get("/children", async (req: any, res) => {
    try {
        const students = await Student.find({ parentId: req.user._id });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get specific child dashboard data
router.get("/child/:studentId/dashboard", async (req: any, res) => {
    try {
        const { studentId } = req.params;
        // Verify child belongs to parent
        const student = await Student.findOne({ _id: studentId, parentId: req.user._id });
        if (!student) return res.status(403).json({ message: "Access denied" });

        const attendance = await Attendance.find({ studentId }).sort({ date: -1 }).limit(5);
        const fees = await Fee.find({ studentId }).sort({ dueDate: -1 });
        const timetable = await Timetable.find({ classId: student.classId, section: student.section, status: "approved" });

        res.json({ student, attendance, fees, timetable });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/child/:studentId/attendance", getPersonalAttendance);
router.get("/child/:studentId/homework", getPersonalHomework);
router.get("/child/:studentId/transport", getStudentTransport);

export default router;
