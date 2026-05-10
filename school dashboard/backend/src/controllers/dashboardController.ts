import { Request, Response } from "express";
import Student from "../models/Student";
import Staff from "../models/Staff";
import Attendance from "../models/Attendance";
import Fee from "../models/Fee";
import Admission from "../models/Admission";

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore
    const schoolId = req.user.schoolId;

    if (!schoolId) {
      res.status(400).json({ message: "No school assigned to this admin" });
      return;
    }

    const [
      totalStudents,
      totalStaff,
      todayAttendance,
      totalFees,
      pendingAdmissions
    ] = await Promise.all([
      Student.countDocuments({ schoolId }),
      Staff.countDocuments({ schoolId }),
      Attendance.countDocuments({ 
        schoolId, 
        date: { 
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lte: new Date(new Date().setHours(23, 59, 59, 999))
        },
        status: "present"
      }),
      Fee.aggregate([
        { $match: { schoolId } },
        { $group: { _id: null, total: { $sum: "$amount" }, paid: { $sum: "$paidAmount" } } }
      ]),
      Admission.countDocuments({ schoolId, status: "pending" })
    ]);

    res.json({
      metrics: {
        totalStudents,
        totalStaff,
        todayAttendance,
        feeCollection: totalFees[0] || { total: 0, paid: 0 },
        pendingAdmissions
      },
      recentActivity: [
        { id: 1, type: "admission", message: "New admission request for Grade 10", time: "2h ago" },
        { id: 2, type: "fee", message: "Monthly fee collected from 45 students", time: "5h ago" },
        { id: 3, type: "attendance", message: "Staff attendance marked for today", time: "6h ago" },
      ]
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
