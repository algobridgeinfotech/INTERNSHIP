import mongoose, { Schema, Document } from "mongoose";

export interface IAdmission extends Document {
  schoolId: mongoose.Types.ObjectId;
  studentName: string;
  email: string;
  phone: string;
  parentName: string;
  appliedClass: string;
  status: "pending" | "approved" | "rejected" | "waitlisted";
  documents: string[];
  interviewDate?: Date;
  notes?: string;
}

const AdmissionSchema: Schema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true, index: true },
  studentName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  parentName: { type: String, required: true },
  appliedClass: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected", "waitlisted"], default: "pending" },
  documents: [{ type: String }],
  interviewDate: { type: Date },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.models.Admission || mongoose.model<IAdmission>("Admission", AdmissionSchema);
