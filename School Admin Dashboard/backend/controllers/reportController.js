import Attendance from "../models/Attendance.js";
import Fee from "../models/Fee.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";

export const getReportSummary = async (_req, res) => {
  const [totalStudents, totalTeachers, feeSummary, classWiseStudents, attendanceSummary] = await Promise.all([
    Student.countDocuments(),
    Teacher.countDocuments(),
    Fee.aggregate([{ $group: { _id: "$status", total: { $sum: "$paidAmount" }, count: { $sum: 1 } } }]),
    Student.aggregate([{ $group: { _id: "$className", count: { $sum: 1 }, avgAttendance: { $avg: "$attendancePercentage" } } }, { $sort: { _id: 1 } }]),
    Attendance.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }])
  ]);

  const feeCollected = feeSummary.reduce((sum, item) => sum + item.total, 0);
  const attendanceTotal = attendanceSummary.reduce((sum, item) => sum + item.count, 0);
  const presentCount = attendanceSummary.filter((item) => ["Present", "Late"].includes(item._id)).reduce((sum, item) => sum + item.count, 0);

  res.json({
    totalStudents,
    totalTeachers,
    feeCollected,
    averageAttendance: attendanceTotal ? Math.round((presentCount / attendanceTotal) * 100) : 0,
    classWiseStudents,
    feeSummary,
    attendanceSummary
  });
};

export const exportStudentsCsv = async (_req, res) => {
  const students = await Student.find().sort({ className: 1, rollNumber: 1 });
  const rows = [
    ["Name", "Roll Number", "Class", "Section", "Fee Status", "Attendance %"],
    ...students.map((student) => [student.name, student.rollNumber, student.className, student.section, student.feeStatus, student.attendancePercentage])
  ];
  const csv = rows.map((row) => row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=students-report.csv");
  res.send(csv);
};
