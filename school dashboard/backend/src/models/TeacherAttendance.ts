import mongoose, { Schema, Document } from "mongoose";

export interface ITeacherAttendance extends Document {
  teacherId: mongoose.Types.ObjectId;
  schoolId: mongoose.Types.ObjectId;
  date: Date;
  clockIn: Date;
  clockOut?: Date;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  deviceInfo: string;
  ipAddress: string;
  status: "present" | "late" | "half-day";
  workingHours?: number;
  createdAt: Date;
}

const TeacherAttendanceSchema: Schema = new Schema(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    date: { type: Date, required: true },
    clockIn: { type: Date, required: true },
    clockOut: { type: Date },
    location: {
      lat: { type: Number },
      lng: { type: Number },
      address: { type: String }
    },
    deviceInfo: { type: String },
    ipAddress: { type: String },
    status: { type: String, enum: ["present", "late", "half-day"], default: "present" },
    workingHours: { type: Number }
  },
  { timestamps: true }
);

export default mongoose.models.TeacherAttendance || mongoose.model<ITeacherAttendance>("TeacherAttendance", TeacherAttendanceSchema);
