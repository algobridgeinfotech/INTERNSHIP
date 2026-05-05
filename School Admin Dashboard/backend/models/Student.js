import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    label: { type: String, default: "Document" },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    resourceType: { type: String, default: "image" }
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, unique: true, trim: true },
    className: { type: String, required: true, trim: true },
    section: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    guardianName: { type: String, trim: true },
    address: { type: String, trim: true },
    photo: {
      url: String,
      publicId: String
    },
    documents: [documentSchema],
    feeStatus: { type: String, enum: ["Paid", "Unpaid", "Partial"], default: "Unpaid" },
    attendancePercentage: { type: Number, default: 0, min: 0, max: 100 }
  },
  { timestamps: true }
);

studentSchema.index({ name: "text", rollNumber: "text", className: "text" });

export default mongoose.model("Student", studentSchema);
