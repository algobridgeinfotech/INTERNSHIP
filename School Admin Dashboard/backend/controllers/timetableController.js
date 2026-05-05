import Timetable from "../models/Timetable.js";
import { getTeacherProfileForUser } from "./teacherController.js";

const findConflict = async ({ teacher, className, day, timeSlot }, ignoreId) => {
  const base = { day, timeSlot };
  const ignore = ignoreId ? { _id: { $ne: ignoreId } } : {};
  return Timetable.findOne({ ...ignore, ...base, $or: [{ teacher }, { className }] });
};

export const createTimetableEntry = async (req, res) => {
  const conflict = await findConflict(req.body);
  if (conflict) {
    return res.status(409).json({ message: "Schedule conflict: teacher or class already has this time slot" });
  }

  const entry = await Timetable.create(req.body);
  const populated = await entry.populate("teacher", "name subject");
  res.status(201).json(populated);
};

export const getTimetable = async (req, res) => {
  const query = {};
  if (req.query.class || req.query.className) query.className = req.query.class || req.query.className;
  if (req.query.day) query.day = req.query.day;

  if (req.user.role === "teacher") {
    const teacher = await getTeacherProfileForUser(req.user._id);
    if (!teacher) return res.status(403).json({ message: "Teacher profile is not assigned yet" });
    query.teacher = teacher._id;
  }

  const entries = await Timetable.find(query).populate("teacher", "name subject").sort({ day: 1, timeSlot: 1 });
  res.json(entries);
};

export const updateTimetableEntry = async (req, res) => {
  const conflict = await findConflict(req.body, req.params.id);
  if (conflict) {
    return res.status(409).json({ message: "Schedule conflict: teacher or class already has this time slot" });
  }

  const entry = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate("teacher", "name subject");
  if (!entry) return res.status(404).json({ message: "Timetable entry not found" });
  res.json(entry);
};

export const deleteTimetableEntry = async (req, res) => {
  const entry = await Timetable.findByIdAndDelete(req.params.id);
  if (!entry) return res.status(404).json({ message: "Timetable entry not found" });
  res.json({ message: "Timetable entry deleted" });
};
