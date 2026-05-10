import mongoose, { Schema, Document } from "mongoose";

export interface IHomework extends Document {
  teacherId: mongoose.Types.ObjectId;
  schoolId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  section: string;
  subjectId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  attachments: string[];
  dueDate: Date;
  status: "published" | "draft" | "closed";
  createdAt: Date;
}

const HomeworkSchema: Schema = new Schema(
  {
    teacherId: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    section: { type: String, required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    title: { type: String, required: true },
    description: { type: String },
    attachments: [{ type: String }],
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["published", "draft", "closed"], default: "published" }
  },
  { timestamps: true }
);

export default mongoose.models.Homework || mongoose.model<IHomework>("Homework", HomeworkSchema);
