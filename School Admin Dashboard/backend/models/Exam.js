import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    maxMarks: { type: Number, required: true, min: 1, default: 100 }
  },
  { _id: false }
);

const examSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["Midterm", "Final", "Unit Test", "Other"], default: "Unit Test" },
    className: { type: String, required: true, trim: true },
    subjects: [subjectSchema],
    startDate: Date,
    endDate: Date,
    resultsLocked: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Exam", examSchema);
