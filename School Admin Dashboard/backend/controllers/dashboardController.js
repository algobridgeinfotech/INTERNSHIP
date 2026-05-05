import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import Fee from "../models/Fee.js";
import Teacher from "../models/Teacher.js";
import { getTeacherProfileForUser } from "./teacherController.js";

export const getDashboardStats = async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  const studentQuery = {};
  const attendanceQuery = { date: { $gte: todayStart, $lt: todayEnd } };

  if (req.user.role === "teacher") {
    const teacher = await getTeacherProfileForUser(req.user._id);
    if (!teacher) return res.status(403).json({ message: "Teacher profile is not assigned yet" });
    studentQuery.className = teacher.assignedClass;
    attendanceQuery.className = teacher.assignedClass;
  }

  const [totalStudents, totalTeachers, presentToday, absentToday, feeSummary] = await Promise.all([
    Student.countDocuments(studentQuery),
    req.user.role === "admin" ? Teacher.countDocuments() : Promise.resolve(1),
    Attendance.countDocuments({ ...attendanceQuery, status: { $in: ["Present", "Late"] } }),
    Attendance.countDocuments({ ...attendanceQuery, status: "Absent" }),
    req.user.role === "admin"
      ? Fee.aggregate([{ $group: { _id: null, collected: { $sum: "$paidAmount" }, expected: { $sum: "$amount" }, unpaidCount: { $sum: { $cond: [{ $eq: ["$status", "Unpaid"] }, 1, 0] } } } }])
      : Promise.resolve([])
  ]);

  res.json({
    totalStudents,
    totalTeachers,
    attendance: { presentToday, absentToday },
    fees: feeSummary[0] || { collected: 0, expected: 0, unpaidCount: 0 }
  });
};
