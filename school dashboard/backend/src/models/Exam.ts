import mongoose, { Schema, Document } from "mongoose";

export interface IExam extends Document {
  schoolId: mongoose.Types.ObjectId;
  title: string;
  type: "term" | "unit" | "final" | "assignment";
  startDate: Date;
  endDate: Date;
  status: "upcoming" | "active" | "completed" | "published";
  description?: string;
}

const ExamSchema: Schema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true, index: true },
  title: { type: String, required: true },
  type: { type: String, enum: ["term", "unit", "final", "assignment"], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ["upcoming", "active", "completed", "published"], default: "upcoming" },
  description: { type: String },
}, { timestamps: true });

export default mongoose.models.Exam || mongoose.model<IExam>("Exam", ExamSchema);
