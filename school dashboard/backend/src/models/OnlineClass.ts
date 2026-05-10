import mongoose, { Schema, Document } from "mongoose";

export interface IOnlineClass extends Document {
  teacherId: mongoose.Types.ObjectId;
  schoolId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  section: string;
  subjectId: mongoose.Types.ObjectId;
  title: string;
  meetingLink: string;
  platform: "zoom" | "google_meet" | "teams";
  startTime: Date;
  endTime: Date;
  recordings?: string[];
  materials?: string[];
  status: "scheduled" | "live" | "completed" | "cancelled";
}

const OnlineClassSchema: Schema = new Schema(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    section: { type: String, required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    title: { type: String, required: true },
    meetingLink: { type: String, required: true },
    platform: { type: String, enum: ["zoom", "google_meet", "teams"], default: "google_meet" },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    recordings: [{ type: String }],
    materials: [{ type: String }],
    status: { type: String, enum: ["scheduled", "live", "completed", "cancelled"], default: "scheduled" }
  },
  { timestamps: true }
);

export default mongoose.models.OnlineClass || mongoose.model<IOnlineClass>("OnlineClass", OnlineClassSchema);
