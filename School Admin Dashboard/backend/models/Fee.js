import mongoose from "mongoose";

const feeSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, default: 0, min: 0 },
    dueDate: { type: Date, required: true },
    paidDate: Date,
    status: { type: String, enum: ["Paid", "Unpaid", "Partial"], default: "Unpaid" },
    paymentMethod: { type: String, trim: true },
    receiptNumber: { type: String, unique: true, sparse: true }
  },
  { timestamps: true }
);

export default mongoose.model("Fee", feeSchema);
