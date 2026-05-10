import { Request, Response } from "express";
import Timetable from "../models/Timetable";
import Staff from "../models/Staff";
import Student from "../models/Student";
import { UserRole } from "../utils/constants";

export const getTimetables = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const { schoolId, role } = req.user;
        const { classId, section } = req.query;
        
        let query: any = { schoolId };
        if (classId) query.classId = classId;
        if (section) query.section = section;
        
        // Non-admin roles see only approved timetables
        const adminRoles = [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.SCHOOL_CONTROLLER];
        if (!adminRoles.includes(role as UserRole)) {
            query.status = "approved";
        }

        const timetables = await Timetable.find(query)
            .populate("classId", "name")
            .populate("periods.subjectId", "name")
            .populate("periods.teacherId", "name");
            
        res.json(timetables);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const upsertTimetable = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const { schoolId, role } = req.user;
        const { classId, section, day, periods } = req.body;
        
        // Conflict Detection
        for (const period of periods) {
            const conflict = await Timetable.findOne({
                schoolId,
                day,
                _id: { $ne: req.body.id }, // Ignore self if updating
                status: { $ne: "rejected" },
                $or: [
                    {
                        "periods": {
                            $elemMatch: {
                                teacherId: period.teacherId,
                                startTime: period.startTime,
                                endTime: period.endTime
                            }
                        }
                    },
                    {
                        "periods": {
                            $elemMatch: {
                                room: period.room,
                                startTime: period.startTime,
                                endTime: period.endTime
                            }
                        }
                    }
                ]
            });

            if (conflict) {
                res.status(400).json({ 
                    message: "Conflict detected: Teacher or Room already assigned for this period.",
                    conflict 
                });
                return;
            }
        }

        const timetable = await Timetable.findOneAndUpdate(
            { schoolId, classId, section, day },
            { 
                periods,
                status: role === UserRole.SCHOOL_ADMIN ? "approved" : "pending" 
            },
            { upsert: true, new: true }
        );
        
        res.json(timetable);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};

export const approveTimetable = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const { id: userId } = req.user;
        const { id } = req.params;
        const { status } = req.body; // approved or rejected

        const timetable = await Timetable.findByIdAndUpdate(
            id,
            { status, approvedBy: userId },
            { new: true }
        );
        
        res.json(timetable);
    } catch (error) {
        res.status(500).json({ message: "Failed to update status" });
    }
};

export const getTeacherTimetable = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const { id: userId, schoolId } = req.user;
        const staff = await Staff.findOne({ userId });
        if (!staff) {
            res.status(404).json({ message: "Staff record not found" });
            return;
        }

        const timetables = await Timetable.find({ 
            schoolId, 
            status: "approved",
            "periods.teacherId": staff._id 
        })
        .populate("classId", "name")
        .populate("periods.subjectId", "name");

        res.json(timetables);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const getStudentTimetable = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        const { id: userId, schoolId } = req.user;
        const student = await Student.findOne({ userId });
        if (!student) {
            res.status(404).json({ message: "Student record not found" });
            return;
        }

        const timetables = await Timetable.find({ 
            schoolId, 
            classId: student.classId, 
            section: student.section,
            status: "approved" 
        })
        .populate("periods.subjectId", "name")
        .populate("periods.teacherId", "name");

        res.json(timetables);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
