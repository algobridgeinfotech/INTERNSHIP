import { Request, Response } from "express";
import mongoose from "mongoose";
import Staff from "../models/Staff";
import Subject from "../models/Subject";
import Student from "../models/Student";
import User from "../models/User";
import bcrypt from "bcryptjs";
import TeacherAttendance from "../models/TeacherAttendance";
import StudentAttendance from "../models/Attendance";
import Homework from "../models/Homework";
import Submission from "../models/Submission";
import ExamMark from "../models/ExamMark";
import OnlineClass from "../models/OnlineClass";
import Timetable from "../models/Timetable";
import Notification from "../models/Notification";

// Helper to get teacher's staff record from user context
const getStaffRecord = async (userId: string) => {
    return await Staff.findOne({ userId });
};

interface AuthRequest extends Request {
    user?: any;
}

// Helper to generate IDs
const generateID = (prefix: string) => `${prefix}-${Math.floor(10000 + Math.random() * 90000)}`;

// --- TEACHER ONBOARDING ---

export const createTeacher = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { password, ...profileData } = req.body;
        const schoolId = req.user?.schoolId || profileData.schoolId;

        const existingUser = await User.findOne({ email: profileData.email });
        if (existingUser) {
            res.status(400).json({ message: "A teacher with this email already exists" });
            return;
        }

        const tempPassword = password || "Welcome@123";
        const hashedPwd = await bcrypt.hash(tempPassword, 10);
        
        const teacherUser = new User({
            name: profileData.name,
            email: profileData.email,
            password: hashedPwd,
            role: "TEACHER",
            schoolId: schoolId,
            isFirstLogin: true,
            customId: generateID("TCH")
        });
        const savedTeacherUser = await teacherUser.save();

        const teacherMember = new Staff({
            ...profileData,
            role: "Teacher",
            userId: savedTeacherUser._id,
            schoolId: schoolId,
            staffId: teacherUser.customId
        });
        const savedTeacher = await teacherMember.save();

        res.status(201).json({
            ...savedTeacher.toObject(),
            tempPassword
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};

// --- TEACHER OPERATIONS ---

export const getAssignedMetadata = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const staff = await getStaffRecord(userId);
        if (!staff) {
            res.status(404).json({ message: "Teacher record not found" });
            return;
        }

        const assignedSubjects = await Subject.find({ teacherId: staff._id }).populate("classId");
        
        const metadata = assignedSubjects.reduce((acc: any, sub: any) => {
            if (!sub.classId) return acc;
            const clsName = sub.classId.name;
            const clsId = sub.classId._id;
            
            if (!acc[clsId]) {
                acc[clsId] = {
                    id: clsId,
                    name: clsName,
                    sections: sub.classId.sections || ["A", "B"],
                    subjects: []
                };
            }
            
            acc[clsId].subjects.push({
                id: sub._id,
                name: sub.name,
                code: sub.code
            });
            
            return acc;
        }, {});

        res.json(Object.values(metadata));
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch metadata" });
    }
};

export const getTeacherDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const staff = await getStaffRecord(userId);
        if (!staff) {
            res.status(404).json({ message: "Teacher record not found" });
            return;
        }

        const assignedSubjects = await Subject.find({ teacherId: staff._id }).populate("classId");
        const classIds = [...new Set(assignedSubjects.map(s => s.classId?._id).filter(id => id))];
        
        const [
            totalStudents,
            pendingHomework,
            todayClasses,
            notifications
        ] = await Promise.all([
            Student.countDocuments({ schoolId: staff.schoolId, classId: { $in: classIds } }),
            Submission.countDocuments({ schoolId: staff.schoolId, status: "pending", workType: "homework" }),
            Timetable.find({ schoolId: staff.schoolId, "periods.teacherId": staff._id }),
            Notification.find({ schoolId: staff.schoolId, targetType: { $in: ["Staff", "All"] } }).sort({ createdAt: -1 }).limit(5)
        ]);

        res.json({
            metrics: {
                assignedClasses: classIds.length,
                assignedSubjects: assignedSubjects.length,
                totalStudents,
                pendingHomework,
            },
            todayClasses,
            notifications
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};

export const clockIn = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const staff = await getStaffRecord(userId);
        const { lat, lng, deviceInfo } = req.body;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existing = await TeacherAttendance.findOne({ teacherId: staff?._id, date: today });
        if (existing) {
            res.status(400).json({ message: "Already clocked in today" });
            return;
        }

        const attendance = await TeacherAttendance.create({
            teacherId: staff?._id,
            schoolId: staff?.schoolId,
            date: today,
            clockIn: new Date(),
            location: { lat, lng },
            deviceInfo,
            ipAddress: req.ip,
            status: new Date().getHours() > 9 ? "late" : "present"
        });

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: "Clock-in failed" });
    }
};

export const clockOut = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const staff = await getStaffRecord(userId);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await TeacherAttendance.findOne({ teacherId: staff?._id, date: today });
        if (!attendance) {
            res.status(400).json({ message: "No clock-in record found for today" });
            return;
        }

        attendance.clockOut = new Date();
        attendance.workingHours = (attendance.clockOut.getTime() - attendance.clockIn.getTime()) / (1000 * 60 * 60);
        await attendance.save();

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: "Clock-out failed" });
    }
};

export const getAssignedStudents = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const staff = await getStaffRecord(userId);
        const { classId, section, subjectId } = req.query;

        if (!classId || !section || !subjectId) {
            res.status(400).json({ message: "Class, Section, and Subject are required" });
            return;
        }

        const isAssigned = await Subject.findOne({ teacherId: staff?._id, classId, _id: subjectId });
        if (!isAssigned) {
            res.status(403).json({ message: "Not authorized for this subject/class" });
            return;
        }

        const students = await Student.find({ schoolId: staff?.schoolId, classId, section });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch students" });
    }
};

export const markStudentAttendance = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const staff = await getStaffRecord(userId);
        const { classId, section, subjectId, date, attendanceData } = req.body;

        const existing = await StudentAttendance.findOne({ 
            schoolId: staff?.schoolId, 
            classId, 
            section, 
            subjectId, 
            date: new Date(date) 
        });

        if (existing) {
            res.status(400).json({ message: "Attendance already marked for this date" });
            return;
        }

        const records = attendanceData.map((item: any) => ({
            studentId: item.studentId,
            status: item.status,
            remarks: item.remarks
        }));

        await StudentAttendance.create({
            schoolId: staff?.schoolId,
            classId,
            section,
            subjectId,
            teacherId: staff?._id,
            date: new Date(date),
            students: records
        });

        res.json({ message: "Attendance marked successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to mark attendance" });
    }
};

export const createHomework = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const staff = await getStaffRecord(userId);
        const homework = await Homework.create({
            ...req.body,
            teacherId: staff?._id,
            schoolId: staff?.schoolId
        });
        res.json(homework);
    } catch (error) {
        res.status(500).json({ message: "Failed to create homework" });
    }
};

export const getHomeworkSubmissions = async (req: Request, res: Response): Promise<void> => {
    try {
        const { homeworkId } = req.params;
        const submissions = await Submission.find({ workId: homeworkId, workType: "homework" }).populate("studentId");
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch submissions" });
    }
};

export const enterMarks = async (req: Request, res: Response): Promise<void> => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const staff = await getStaffRecord(userId);
        const { examId, studentId, subjectId, marksObtained, totalMarks, grade, remarks } = req.body;

        const mark = await ExamMark.findOneAndUpdate(
            { examId, studentId, subjectId },
            { 
                schoolId: staff?.schoolId,
                teacherId: staff?._id,
                marksObtained, 
                totalMarks, 
                grade, 
                remarks 
            },
            { upsert: true, new: true }
        );

        res.json(mark);
    } catch (error) {
        res.status(500).json({ message: "Failed to enter marks" });
    }
};
