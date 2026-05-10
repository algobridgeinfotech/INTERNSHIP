import { Request, Response } from "express";
import Attendance from "../models/Attendance";
import Student from "../models/Student";
import Staff from "../models/Staff";

import { UserRole } from "../utils/constants";

export const markAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore
    const { schoolId, role, id: userId } = req.user;
    const { type, items, date, classId, section } = req.body;

    // If teacher, they should only be marking student attendance
    if (role === UserRole.TEACHER && type !== "student") {
      res.status(403).json({ message: "Teachers can only mark student attendance." });
      return;
    }

    const attendanceRecords = items.map((item: any) => ({
      schoolId,
      type,
      studentId: type === "student" ? item.id : undefined,
      staffId: type === "staff" ? item.id : undefined,
      classId: classId,
      section: section,
      date: new Date(date),
      status: item.status,
      remarks: item.remarks,
      markedBy: userId
    }));

    // In a production app, we'd check if the teacher is actually assigned to this class
    // via Timetable or ClassTeacher field.

    await Attendance.insertMany(attendanceRecords);
    res.status(201).json({ message: "Attendance marked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

export const getAttendanceReport = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore
    const schoolId = req.user.schoolId;
    const { type, date, classId } = req.query;

    const query: any = { schoolId, type };
    if (date) {
      query.date = {
        $gte: new Date(new Date(date as string).setHours(0, 0, 0, 0)),
        $lte: new Date(new Date(date as string).setHours(23, 59, 59, 999))
      };
    }
    if (classId) query.classId = classId;

    const report = await Attendance.find(query)
      .populate("studentId", "name rollNumber")
      .populate("staffId", "name employeeId");

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
