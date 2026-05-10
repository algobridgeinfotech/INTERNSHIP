import mongoose, { Schema, Document } from "mongoose";

export interface ISubject extends Document {
  schoolId: mongoose.Types.ObjectId;
  name: string;
  code: string;
  classId: mongoose.Types.ObjectId;
  teacherId?: mongoose.Types.ObjectId;
}

const SubjectSchema: Schema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: "Staff" }
}, { timestamps: true });

export default mongoose.models.Subject || mongoose.model<ISubject>("Subject", SubjectSchema);
