import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";
import { getTeacherProfileForUser } from "./teacherController.js";

const dayStart = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const refreshAttendancePercentage = async (studentId) => {
  const records = await Attendance.find({ student: studentId });
  const total = records.length;
  const present = records.filter((record) => ["Present", "Late"].includes(record.status)).length;
  const percentage = total ? Math.round((present / total) * 100) : 0;
  await Student.findByIdAndUpdate(studentId, { attendancePercentage: percentage });
  return percentage;
};

const ensureTeacherCanMarkStudent = async (user, student) => {
  if (user.role !== "teacher") return null;
  const teacher = await getTeacherProfileForUser(user._id);
  if (!teacher) return "Teacher profile is not assigned yet";
  if (student.className !== teacher.assignedClass) return "Teachers can mark attendance only for their assigned class";
  return null;
};

export const markAttendance = async (req, res) => {
  const { studentId, date, status, note } = req.body;
  const student = await Student.findById(studentId);
  if (!student) return res.status(404).json({ message: "Student not found" });

  const ruleError = await ensureTeacherCanMarkStudent(req.user, student);
  if (ruleError) return res.status(403).json({ message: ruleError });

  const attendance = await Attendance.findOneAndUpdate(
    { student: studentId, date: dayStart(date) },
    {
      student: studentId,
      date: dayStart(date),
      status,
      note,
      markedBy: req.user._id,
      className: student.className,
      section: student.section
    },
    { upsert: true, new: true, runValidators: true }
  );

  const percentage = await refreshAttendancePercentage(studentId);
  res.status(201).json({ attendance, attendancePercentage: percentage });
};

export const bulkMarkAttendance = async (req, res) => {
  const { date, records } = req.body;
  if (!Array.isArray(records) || !records.length) {
    return res.status(400).json({ message: "Attendance records are required" });
  }

  const students = await Student.find({ _id: { $in: records.map((item) => item.studentId) } });
  const studentMap = new Map(students.map((student) => [student._id.toString(), student]));

  for (const item of records) {
    const student = studentMap.get(item.studentId);
    if (!student) return res.status(404).json({ message: `Student not found: ${item.studentId}` });
    const ruleError = await ensureTeacherCanMarkStudent(req.user, student);
    if (ruleError) return res.status(403).json({ message: ruleError });
  }

  const normalizedDate = dayStart(date);
  const operations = records.map((item) => {
    const student = studentMap.get(item.studentId);
    return {
      updateOne: {
        filter: { student: item.studentId, date: normalizedDate },
        update: {
          $set: {
            student: item.studentId,
            date: normalizedDate,
            status: item.status,
            note: item.note,
            markedBy: req.user._id,
            className: student.className,
            section: student.section
          }
        },
        upsert: true
      }
    };
  });

  await Attendance.bulkWrite(operations);
  await Promise.all(records.map((item) => refreshAttendancePercentage(item.studentId)));
  res.status(201).json({ message: "Bulk attendance saved", count: records.length });
};

export const updateAttendance = async (req, res) => {
  const attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!attendance) return res.status(404).json({ message: "Attendance not found" });
  await refreshAttendancePercentage(attendance.student);
  res.json(attendance);
};

export const getAttendance = async (req, res) => {
  const query = {};
  if (req.query.class || req.query.className) query.className = req.query.class || req.query.className;
  if (req.query.section) query.section = req.query.section;
  if (req.query.date) query.date = dayStart(req.query.date);

  if (req.user.role === "teacher") {
    const teacher = await getTeacherProfileForUser(req.user._id);
    if (!teacher) return res.status(403).json({ message: "Teacher profile is not assigned yet" });
    query.className = teacher.assignedClass;
  }

  const attendance = await Attendance.find(query)
    .populate("student", "name rollNumber className section")
    .populate("markedBy", "name role")
    .sort({ date: -1 });
  res.json(attendance);
};
