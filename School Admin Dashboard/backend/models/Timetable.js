import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
  {
    className: { type: String, required: true, trim: true },
    day: { type: String, required: true, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
    subject: { type: String, required: true, trim: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    timeSlot: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

timetableSchema.index({ teacher: 1, day: 1, timeSlot: 1 }, { unique: true });
timetableSchema.index({ className: 1, day: 1, timeSlot: 1 }, { unique: true });

export default mongoose.model("Timetable", timetableSchema);
