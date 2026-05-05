import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    status: { type: String, enum: ["Present", "Absent", "Late"], required: true }
  },
  { _id: false }
);

const teacherSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, sparse: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    subject: { type: String, required: true, trim: true },
    assignedClass: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    salary: { type: Number, default: 0, min: 0 },
    attendance: [attendanceSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);
