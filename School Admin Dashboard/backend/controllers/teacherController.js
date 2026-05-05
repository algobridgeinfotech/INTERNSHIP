import Teacher from "../models/Teacher.js";
import User from "../models/User.js";

export const getTeacherProfileForUser = async (userId) => Teacher.findOne({ user: userId });

export const createTeacher = async (req, res) => {
  const { name, email, password = "teacher123", subject, assignedClass, phone, salary } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "A user with this email already exists" });

  const user = await User.create({ name, email, password, role: "teacher" });
  const teacher = await Teacher.create({ user: user._id, name, email, subject, assignedClass, phone, salary });
  res.status(201).json({ ...teacher.toObject(), defaultPassword: password });
};

export const getTeachers = async (_req, res) => {
  const teachers = await Teacher.find().populate("user", "name email role").sort({ createdAt: -1 });
  res.json(teachers);
};

export const updateTeacher = async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) return res.status(404).json({ message: "Teacher not found" });

  const allowed = ["name", "email", "subject", "assignedClass", "phone", "salary"];
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) teacher[key] = req.body[key];
  });
  await teacher.save();

  if (teacher.user) {
    await User.findByIdAndUpdate(teacher.user, { name: teacher.name, email: teacher.email }, { runValidators: true });
  }

  res.json(teacher);
};

export const deleteTeacher = async (req, res) => {
  const teacher = await Teacher.findByIdAndDelete(req.params.id);
  if (!teacher) return res.status(404).json({ message: "Teacher not found" });
  if (teacher.user) await User.findByIdAndDelete(teacher.user);
  res.json({ message: "Teacher deleted" });
};

export const markTeacherAttendance = async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) return res.status(404).json({ message: "Teacher not found" });

  const date = new Date(req.body.date);
  const existing = teacher.attendance.find((item) => item.date.toDateString() === date.toDateString());
  if (existing) existing.status = req.body.status;
  else teacher.attendance.push({ date, status: req.body.status });

  await teacher.save();
  res.json(teacher);
};
