import mongoose, { Schema, Document } from "mongoose";

export interface IAttendance extends Document {
  schoolId: mongoose.Types.ObjectId;
  type: "student" | "staff";
  studentId?: mongoose.Types.ObjectId;
  staffId?: mongoose.Types.ObjectId;
  date: Date;
  status: "present" | "absent" | "late" | "half_day";
  remarks?: string;
  classId?: string;
  sectionId?: string;
  markedBy?: mongoose.Types.ObjectId;
}

const AttendanceSchema: Schema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true, index: true },
  type: { type: String, enum: ["student", "staff"], required: true },
  studentId: { type: Schema.Types.ObjectId, ref: "Student" },
  staffId: { type: Schema.Types.ObjectId, ref: "Staff" },
  date: { type: Date, required: true, index: true },
  status: { type: String, enum: ["present", "absent", "late", "half_day"], required: true },
  remarks: { type: String },
  classId: { type: String },
  sectionId: { type: String },
  markedBy: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.models.Attendance || mongoose.model<IAttendance>("Attendance", AttendanceSchema);
