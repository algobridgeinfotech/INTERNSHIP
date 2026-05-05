import readXlsxFile from "read-excel-file/node";
import { parse } from "csv-parse/sync";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js";
import Fee from "../models/Fee.js";
import { uploadBufferToCloudinary } from "../utils/cloudinaryUpload.js";
import { getTeacherProfileForUser } from "./teacherController.js";

const buildStudentQuery = async (req) => {
  const { search, class: classParam, className: classNameParam, section, status, minAttendance, maxAttendance } = req.query;
  const mongoQuery = {};
  const className = classNameParam || classParam;

  if (search) {
    mongoQuery.$or = [
      { name: { $regex: search, $options: "i" } },
      { rollNumber: { $regex: search, $options: "i" } },
      { className: { $regex: search, $options: "i" } }
    ];
  }

  if (className) mongoQuery.className = className;
  if (section) mongoQuery.section = section;
  if (status) mongoQuery.feeStatus = status;

  if (minAttendance || maxAttendance) {
    mongoQuery.attendancePercentage = {};
    if (minAttendance) mongoQuery.attendancePercentage.$gte = Number(minAttendance);
    if (maxAttendance) mongoQuery.attendancePercentage.$lte = Number(maxAttendance);
  }

  if (req.user.role === "teacher") {
    const teacher = await getTeacherProfileForUser(req.user._id);
    if (!teacher) throw new Error("Teacher profile is not assigned yet");
    mongoQuery.className = teacher.assignedClass;
  }

  return mongoQuery;
};

export const createStudent = async (req, res) => {
  const photo = req.file ? await uploadBufferToCloudinary(req.file.buffer, "student-dashboard/photos") : null;
  const student = await Student.create({
    ...req.body,
    photo: photo ? { url: photo.secure_url, publicId: photo.public_id } : undefined
  });

  res.status(201).json(student);
};

export const getStudents = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  let query;

  try {
    query = await buildStudentQuery(req);
  } catch (error) {
    return res.status(403).json({ message: error.message });
  }

  const [students, total] = await Promise.all([
    Student.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Student.countDocuments(query)
  ]);

  res.json({
    data: students,
    pagination: { total, page, pages: Math.ceil(total / limit), limit }
  });
};

export const getStudentById = async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });

  if (req.user.role === "teacher") {
    const teacher = await getTeacherProfileForUser(req.user._id);
    if (!teacher || student.className !== teacher.assignedClass) {
      return res.status(403).json({ message: "Teachers can view only assigned class students" });
    }
  }

  const [attendance, fees] = await Promise.all([
    Attendance.find({ student: student._id }).sort({ date: -1 }).limit(30),
    Fee.find({ student: student._id }).sort({ dueDate: -1 })
  ]);

  res.json({ student, attendance, fees });
};

export const updateStudent = async (req, res) => {
  const update = { ...req.body };

  if (req.file) {
    const photo = await uploadBufferToCloudinary(req.file.buffer, "student-dashboard/photos");
    update.photo = { url: photo.secure_url, publicId: photo.public_id };
  }

  const student = await Student.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true
  });

  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json(student);
};

export const deleteStudent = async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });

  await Promise.all([Attendance.deleteMany({ student: student._id }), Fee.deleteMany({ student: student._id })]);

  res.json({ message: "Student deleted" });
};

export const uploadStudentDocument = async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });
  if (!req.file) return res.status(400).json({ message: "File is required" });

  const uploaded = await uploadBufferToCloudinary(req.file.buffer, "student-dashboard/documents");
  student.documents.push({
    label: req.body.label || req.file.originalname,
    url: uploaded.secure_url,
    publicId: uploaded.public_id,
    resourceType: uploaded.resource_type
  });
  await student.save();

  res.status(201).json(student);
};

export const bulkUploadStudents = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "CSV or Excel file is required" });

  const extension = req.file.originalname.split(".").pop().toLowerCase();
  let rows = [];

  if (extension === "csv") {
    rows = parse(req.file.buffer, { columns: true, skip_empty_lines: true, trim: true });
  } else {
    const table = await readXlsxFile(req.file.buffer);
    const [headers = [], ...body] = table;
    rows = body.map((cells) =>
      headers.reduce((item, header, index) => {
        item[String(header || "").trim()] = cells[index];
        return item;
      }, {})
    );
  }

  const students = rows.map((row) => ({
    name: row.name || row.Name,
    rollNumber: String(row.rollNumber || row["Roll Number"] || row.roll || ""),
    className: String(row.className || row.Class || row.class || ""),
    section: String(row.section || row.Section || ""),
    email: row.email || row.Email,
    phone: row.phone || row.Phone,
    guardianName: row.guardianName || row["Guardian Name"],
    address: row.address || row.Address
  }));

  const inserted = await Student.insertMany(students, { ordered: false });
  res.status(201).json({ message: "Students uploaded", count: inserted.length });
};
