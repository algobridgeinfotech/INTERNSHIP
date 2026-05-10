import mongoose, { Schema, Document } from "mongoose";

export interface IExamMark extends Document {
  examId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  schoolId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  remarks?: string;
  isPractical: boolean;
  internalAssessment?: number;
}

const ExamMarkSchema: Schema = new Schema(
  {
    examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: "Staff", required: true },
    marksObtained: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    grade: { type: String },
    remarks: { type: String },
    isPractical: { type: Boolean, default: false },
    internalAssessment: { type: Number }
  },
  { timestamps: true }
);

// Compound index to prevent duplicate marks entry for same student/exam/subject
ExamMarkSchema.index({ examId: 1, studentId: 1, subjectId: 1 }, { unique: true });

export default mongoose.models.ExamMark || mongoose.model<IExamMark>("ExamMark", ExamMarkSchema);
