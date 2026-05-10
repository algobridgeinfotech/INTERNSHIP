import mongoose, { Schema, Document } from "mongoose";

export interface ISubmission extends Document {
  studentId: mongoose.Types.ObjectId;
  schoolId: mongoose.Types.ObjectId;
  workId: mongoose.Types.ObjectId; // References Homework or Assignment
  workType: "homework" | "assignment";
  files: string[];
  studentNote?: string;
  teacherRemarks?: string;
  status: "pending" | "reviewed" | "rejected" | "completed";
  grade?: string;
  marks?: number;
  submittedAt: Date;
}

const SubmissionSchema: Schema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    workId: { type: Schema.Types.ObjectId, required: true },
    workType: { type: String, enum: ["homework", "assignment"], required: true },
    files: [{ type: String }],
    studentNote: { type: String },
    teacherRemarks: { type: String },
    status: { type: String, enum: ["pending", "reviewed", "rejected", "completed"], default: "pending" },
    grade: { type: String },
    marks: { type: Number },
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.models.Submission || mongoose.model<ISubmission>("Submission", SubmissionSchema);
