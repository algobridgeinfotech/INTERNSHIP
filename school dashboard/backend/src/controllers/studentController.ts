import { Request, Response } from "express";
import Student from "../models/Student";
import User, { IUser } from "../models/User";
import bcrypt from "bcryptjs";
import fs from "fs";
import csv from "csv-parser";
import Attendance from "../models/Attendance";
import Homework from "../models/Homework";
import Submission from "../models/Submission";

interface AuthRequest extends Request {
    user?: IUser;
}

// Helper to generate IDs
const generateID = (prefix: string) => `${prefix}-${Math.floor(10000 + Math.random() * 90000)}`;

export const bulkUploadStudents = async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
    }

    const schoolId = req.user?.schoolId || (req.body.schoolId as any);
    if (!schoolId && req.user?.role !== "SUPER_ADMIN") {
        res.status(400).json({ message: "School ID is required" });
        return;
    }

    const results: any[] = [];
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
            try {
                let count = 0;
                for (const row of results) {
                    const tempStudentPass = row.studentPassword || "Welcome@123";
                    const hashedStudentPwd = await bcrypt.hash(tempStudentPass, 10);
                    
                    const studentUser = new User({
                        name: row.name,
                        email: row.email,
                        password: hashedStudentPwd,
                        role: "STUDENT",
                        schoolId: schoolId,
                        isFirstLogin: true,
                        customId: generateID("STD")
                    });
                    const savedStudentUser = await studentUser.save();

                    if (row.parentEmail) {
                        const tempParentPass = row.parentPassword || "Welcome@123";
                        const hashedParentPwd = await bcrypt.hash(tempParentPass, 10);
                        const parentUser = new User({
                            name: row.parentName,
                            email: row.parentEmail,
                            password: hashedParentPwd,
                            role: "PARENT",
                            schoolId: schoolId,
                            isFirstLogin: true,
                            customId: generateID("PRT")
                        });
                        await parentUser.save();
                    }

                    const student = new Student({
                        ...row,
                        admissionNumber: row.admissionNumber || generateID("ADM"),
                        userId: savedStudentUser._id,
                        schoolId: schoolId,
                    });
                    await student.save();
                    count++;
                }

                fs.unlinkSync(req.file!.path);
                res.status(201).json({ message: "Bulk upload successful", count });
            } catch (error) {
                res.status(500).json({ message: "Error saving student records", error: (error as Error).message });
            }
        });
};

export const getStudents = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const filter: any = {};
        if (req.user?.role !== "SUPER_ADMIN") {
            filter.schoolId = req.user?.schoolId;
        } else if (req.query.schoolId) {
            filter.schoolId = req.query.schoolId;
        }

        const students = await Student.find(filter).sort({ createdAt: -1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};

export const getStudentById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            res.status(404).json({ message: "Student not found" });
            return;
        }

        // Access Check
        if (req.user?.role !== "SUPER_ADMIN" && student.schoolId?.toString() !== req.user?.schoolId?.toString()) {
            res.status(403).json({ message: "Access denied" });
            return;
        }

        res.json(student);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};

export const createStudent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { studentPassword, parentPassword, ...profileData } = req.body;
        const schoolId = req.user?.schoolId || profileData.schoolId;

        if (!schoolId) {
            res.status(400).json({ message: "School ID is required" });
            return;
        }

        const existingUser = await User.findOne({ email: profileData.email });
        if (existingUser) {
            res.status(400).json({ message: "A student with this email already exists" });
            return;
        }

        const tempStudentPass = studentPassword || "Welcome@123";
        const hashedStudentPwd = await bcrypt.hash(tempStudentPass, 10);
        const studentUser = new User({
            name: profileData.name,
            email: profileData.email,
            password: hashedStudentPwd,
            role: "STUDENT",
            schoolId: schoolId,
            isFirstLogin: true,
            customId: generateID("STD")
        });
        const savedStudentUser = await studentUser.save();

        let tempParentPass = "";
        if (profileData.parentEmail) {
            let parentUser = await User.findOne({ email: profileData.parentEmail });
            if (!parentUser) {
                tempParentPass = parentPassword || "Welcome@123";
                const hashedParentPwd = await bcrypt.hash(tempParentPass, 10);
                parentUser = new User({
                    name: profileData.parentName,
                    email: profileData.parentEmail,
                    password: hashedParentPwd,
                    role: "PARENT",
                    schoolId: schoolId,
                    isFirstLogin: true,
                    customId: generateID("PRT")
                });
                await parentUser.save();
            }
        }

        const student = new Student({
            ...profileData,
            admissionNumber: profileData.admissionNumber || generateID("ADM"),
            userId: savedStudentUser._id,
            schoolId: schoolId,
        });
        const savedStudent = await student.save();
        
        res.status(201).json({
            ...savedStudent.toObject(),
            tempStudentPass,
            tempParentPass: tempParentPass || "Existing Account"
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};

export const updateStudent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            res.status(404).json({ message: "Student not found" });
            return;
        }

        if (req.user?.role !== "SUPER_ADMIN" && student.schoolId?.toString() !== req.user?.schoolId?.toString()) {
            res.status(403).json({ message: "Access denied" });
            return;
        }

        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};

export const deleteStudent = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            res.status(404).json({ message: "Student not found" });
            return;
        }

        if (req.user?.role !== "SUPER_ADMIN" && student.schoolId?.toString() !== req.user?.schoolId?.toString()) {
            res.status(403).json({ message: "Access denied" });
            return;
        }

        await User.findByIdAndDelete(student.userId);
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};

export const getPersonalAttendance = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        let studentId = req.params.studentId;
        
        if (!studentId) {
            const student = await Student.findOne({ userId: req.user?._id });
            if (!student) {
                res.status(404).json({ message: "Student record not found" });
                return;
            }
            studentId = student._id.toString();
        } else if (req.user?.role === "PARENT") {
            // Verify child belongs to parent
            const student = await Student.findOne({ _id: studentId, parentId: req.user._id });
            if (!student) {
                res.status(403).json({ message: "Access denied" });
                return;
            }
        }

        const attendance = await Attendance.find({ 
            schoolId: req.user?.schoolId,
            studentId
        }).sort({ date: -1 });

        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};

export const getPersonalHomework = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        let student;
        const { studentId } = req.params;

        if (studentId) {
            student = await Student.findOne({ _id: studentId, parentId: req.user?._id });
        } else {
            student = await Student.findOne({ userId: req.user?._id });
        }

        if (!student) {
            res.status(404).json({ message: "Student record not found or access denied" });
            return;
        }

        const homework = await Homework.find({ 
            schoolId: req.user?.schoolId,
            classId: student.classId,
            section: student.section
        }).populate("teacherId", "name");

        res.json(homework);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};
