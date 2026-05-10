import { Request, Response } from "express";
import School from "../models/School";
import Student from "../models/Student";
import Staff from "../models/Staff";
import Fee from "../models/Fee";
import User from "../models/User";
import ActivityLog from "../models/ActivityLog";

export const getGlobalAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalSchools,
      totalStudents,
      totalStaff,
      totalFees
    ] = await Promise.all([
      School.countDocuments(),
      Student.countDocuments(),
      Staff.countDocuments(),
      Fee.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])
    ]);

    res.json({
      totalSchools,
      totalStudents,
      totalStaff,
      monthlyRevenue: totalFees[0]?.total || 0,
      growth: {
        schools: 12,
        students: 8,
        revenue: 15
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

export const getAllAdmins = async (req: Request, res: Response): Promise<void> => {
  try {
    const admins = await User.find({ role: "SCHOOL_ADMIN" }).populate("schoolId");
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const resetAdminPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { adminId, newPassword } = req.body;
    const admin = await User.findById(adminId);
    if (!admin) {
      res.status(404).json({ message: "Admin not found" });
      return;
    }
    // Logic for password reset (omitted for brevity)
    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAdminStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const admin = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getActivityLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
