import Exam from "../models/Exam.js";
import Result from "../models/Result.js";
import Student from "../models/Student.js";
import { getTeacherProfileForUser } from "./teacherController.js";

const getGrade = (percentage) => {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
};

const subjectEquals = (a, b) => String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase();

const summarizeResults = (rows) => {
  const groups = new Map();

  rows.forEach((row) => {
    const key = `${row.exam?._id || row.exam}-${row.student?._id || row.student}`;
    if (!groups.has(key)) {
      groups.set(key, {
        _id: key,
        exam: row.exam,
        student: row.student,
        marks: [],
        totalMarks: 0,
        maxTotalMarks: 0,
        percentage: 0,
        grade: "F",
        rank: null,
        status: "draft"
      });
    }
    const result = groups.get(key);
    result.marks.push({
      id: row._id,
      subject: row.subject,
      marksObtained: row.marks,
      marks: row.marks,
      maxMarks: row.maxMarks,
      status: row.status,
      teacher: row.teacher
    });
    result.totalMarks += Number(row.marks || 0);
    result.maxTotalMarks += Number(row.maxMarks || 0);
    result.status = result.status === "final" || row.status === "final" ? "final" : "draft";
  });

  const summaries = [...groups.values()].map((result) => {
    result.percentage = result.maxTotalMarks ? Number(((result.totalMarks / result.maxTotalMarks) * 100).toFixed(2)) : 0;
    result.grade = getGrade(result.percentage);
    return result;
  });

  const byExam = new Map();
  summaries.forEach((result) => {
    const examId = String(result.exam?._id || result.exam);
    if (!byExam.has(examId)) byExam.set(examId, []);
    byExam.get(examId).push(result);
  });
  byExam.forEach((items) => {
    items.sort((a, b) => b.percentage - a.percentage || b.totalMarks - a.totalMarks);
    items.forEach((item, index) => {
      item.rank = index + 1;
    });
  });

  return summaries.sort((a, b) => String(a.exam?.name || "").localeCompare(String(b.exam?.name || "")) || (a.rank || 0) - (b.rank || 0));
};

const ensureTeacherCanEdit = async (user, exam, student, subject, existing) => {
  if (user.role !== "teacher") return null;
  const teacher = await getTeacherProfileForUser(user._id);
  if (!teacher) return "Teacher profile is not assigned yet";
  if (exam.resultsLocked) return "Result is locked by admin";
  if (student.className !== teacher.assignedClass || exam.className !== teacher.assignedClass) return "Teachers can enter marks only for their assigned class";
  if (!subjectEquals(subject, teacher.subject)) return "Teachers can enter marks only for their assigned subject";
  if (existing && String(existing.teacher) !== String(user._id)) return "Teachers cannot edit another teacher's marks";
  if (existing?.status === "final") return "Final marks cannot be edited by teacher";
  return null;
};

export const createExam = async (req, res) => {
  const exam = await Exam.create(req.body);
  res.status(201).json(exam);
};

export const getExams = async (req, res) => {
  const query = {};
  if (req.user.role === "teacher") {
    const teacher = await getTeacherProfileForUser(req.user._id);
    if (!teacher) return res.status(403).json({ message: "Teacher profile is not assigned yet" });
    query.className = teacher.assignedClass;
  }
  const exams = await Exam.find(query).sort({ createdAt: -1 });
  res.json(exams);
};

export const createResult = async (req, res) => {
  const { examId, studentId, marks = [], status = "draft" } = req.body;
  const [exam, student] = await Promise.all([Exam.findById(examId), Student.findById(studentId)]);
  if (!exam) return res.status(404).json({ message: "Exam not found" });
  if (!student) return res.status(404).json({ message: "Student not found" });

  const saved = [];
  for (const item of marks) {
    const subject = item.subject;
    const marksValue = Number(item.marks ?? item.marksObtained ?? 0);
    const maxMarks = Number(item.maxMarks || exam.subjects.find((examSubject) => subjectEquals(examSubject.name, subject))?.maxMarks || 100);
    const existing = await Result.findOne({ exam: examId, student: studentId, subject });
    const ruleError = await ensureTeacherCanEdit(req.user, exam, student, subject, existing);
    if (ruleError) return res.status(403).json({ message: ruleError });
    if (marksValue > maxMarks) return res.status(400).json({ message: `${subject} marks cannot exceed max marks` });

    const resultStatus = req.user.role === "admin" ? status : "draft";
    const result = await Result.findOneAndUpdate(
      { exam: examId, student: studentId, subject },
      { exam: examId, student: studentId, subject, marks: marksValue, maxMarks, teacher: req.user._id, status: resultStatus },
      { upsert: true, new: true, runValidators: true }
    );
    saved.push(result);
  }

  const rows = await Result.find({ exam: examId, student: studentId })
    .populate("student", "name rollNumber className section")
    .populate("exam", "name type className resultsLocked")
    .populate("teacher", "name role");
  res.status(201).json(summarizeResults(rows)[0] || saved[0]);
};

export const getResultsByStudent = async (req, res) => {
  const query = { student: req.params.studentId };
  if (req.user.role === "teacher") {
    const teacher = await getTeacherProfileForUser(req.user._id);
    if (!teacher) return res.status(403).json({ message: "Teacher profile is not assigned yet" });
    const student = await Student.findById(req.params.studentId);
    if (!student || student.className !== teacher.assignedClass) return res.status(403).json({ message: "Teachers can view only assigned class results" });
  }
  const rows = await Result.find(query)
    .populate("exam", "name type className startDate endDate resultsLocked")
    .populate("student", "name rollNumber className section")
    .populate("teacher", "name role")
    .sort({ createdAt: -1 });
  res.json(summarizeResults(rows));
};

export const getResults = async (req, res) => {
  const query = {};
  if (req.query.examId) query.exam = req.query.examId;
  if (req.query.studentId) query.student = req.query.studentId;

  if (req.user.role === "teacher") {
    const teacher = await getTeacherProfileForUser(req.user._id);
    if (!teacher) return res.status(403).json({ message: "Teacher profile is not assigned yet" });
    const students = await Student.find({ className: teacher.assignedClass }).select("_id");
    query.student = { $in: students.map((student) => student._id) };
  }

  const rows = await Result.find(query)
    .populate("exam", "name type className resultsLocked")
    .populate("student", "name rollNumber className section")
    .populate("teacher", "name role")
    .sort({ createdAt: -1 });
  res.json(summarizeResults(rows));
};

export const setResultLock = async (req, res) => {
  const exam = await Exam.findByIdAndUpdate(req.params.examId, { resultsLocked: Boolean(req.body.locked) }, { new: true });
  if (!exam) return res.status(404).json({ message: "Exam not found" });

  await Result.updateMany({ exam: exam._id }, { status: exam.resultsLocked ? "final" : "draft" });
  res.json({ message: exam.resultsLocked ? "Results locked" : "Results unlocked", exam });
};
