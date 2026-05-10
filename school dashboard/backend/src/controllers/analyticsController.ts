import { Request, Response } from "express";
import School from "../models/School";
import User from "../models/User";
import Student from "../models/Student";
import Staff from "../models/Staff";

// @route   GET /api/analytics/global
// @desc    Get global analytics (Super Admin)
// @access  Private (Super Admin)
export const getGlobalAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalSchools = await School.countDocuments();
    const activeSchools = await School.countDocuments({ status: "active" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    
    // We would sum up across all schools
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const totalStaff = await Staff.countDocuments();

    // Mock revenue for now (could sum from Subscriptions/Invoices in a full system)
    const monthlyRevenue = activeSchools * 150; // assuming $150/mo average

    res.json({
      totalSchools,
      activeSchools,
      totalAdmins,
      totalStudents,
      totalTeachers,
      totalStaff,
      monthlyRevenue,
      growth: {
        schools: 12, // example +12% this month
        revenue: 8,
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
