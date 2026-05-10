import mongoose, { Schema, Document } from "mongoose";

export interface IFee extends Document {
  schoolId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  title: string;
  amount: number;
  dueDate: Date;
  status: "paid" | "unpaid" | "partially_paid";
  paidAmount: number;
  paymentMethod?: string;
  transactionId?: string;
  category: "tuition" | "transport" | "hostel" | "exam" | "other";
}

const FeeSchema: Schema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true, index: true },
  studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true, index: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ["paid", "unpaid", "partially_paid"], default: "unpaid" },
  paidAmount: { type: Number, default: 0 },
  paymentMethod: { type: String },
  transactionId: { type: String },
  category: { type: String, enum: ["tuition", "transport", "hostel", "exam", "other"], required: true },
}, { timestamps: true });

export default mongoose.models.Fee || mongoose.model<IFee>("Fee", FeeSchema);
