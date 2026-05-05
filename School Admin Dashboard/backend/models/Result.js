import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
    subject: { type: String, required: true, trim: true },
    marks: { type: Number, required: true, min: 0 },
    maxMarks: { type: Number, required: true, min: 1 },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["draft", "final"], default: "draft" }
  },
  { timestamps: true }
);

resultSchema.index({ exam: 1, student: 1, subject: 1 }, { unique: true });

export default mongoose.model("Result", resultSchema);
