import mongoose, { Schema, Document } from "mongoose";

export interface ITimetable extends Document {
  schoolId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  section: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  periods: {
    startTime: string;
    endTime: string;
    subjectId: mongoose.Types.ObjectId;
    teacherId: mongoose.Types.ObjectId;
    room?: string;
  }[];
}

const TimetableSchema: Schema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
  classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
  section: { type: String, required: true },
  day: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], required: true },
  periods: [{
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    room: { type: String }
  }],
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  approvedBy: { type: Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default mongoose.models.Timetable || mongoose.model<ITimetable>("Timetable", TimetableSchema);
