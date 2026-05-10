import mongoose, { Schema, Document } from "mongoose";

export interface IInvoice extends Document {
  schoolId: mongoose.Types.ObjectId;
  subscriptionId: mongoose.Types.ObjectId;
  invoiceNumber: string;
  amount: number;
  status: "paid" | "unpaid" | "overdue" | "cancelled";
  dueDate: Date;
  paidAt?: Date;
  paymentMethod?: string;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema: Schema = new Schema(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    subscriptionId: { type: Schema.Types.ObjectId, ref: "Subscription", required: true },
    invoiceNumber: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["paid", "unpaid", "overdue", "cancelled"], default: "unpaid" },
    dueDate: { type: Date, required: true },
    paidAt: { type: Date },
    paymentMethod: { type: String },
    transactionId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);
