import mongoose, { Schema, Document } from "mongoose";

export interface IPayroll extends Document {
  schoolId: mongoose.Types.ObjectId;
  staffId: mongoose.Types.ObjectId;
  month: number;
  year: number;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: "pending" | "approved" | "paid";
  paidAt?: Date;
}

const PayrollSchema: Schema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true, index: true },
  staffId: { type: Schema.Types.ObjectId, ref: "Staff", required: true, index: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  baseSalary: { type: Number, required: true },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  netSalary: { type: Number, required: true },
  status: { type: String, enum: ["pending", "approved", "paid"], default: "pending" },
  paidAt: { type: Date },
}, { timestamps: true });

export default mongoose.models.Payroll || mongoose.model<IPayroll>("Payroll", PayrollSchema);
