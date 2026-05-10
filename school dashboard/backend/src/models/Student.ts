import mongoose, { Schema, Document } from "mongoose";

export interface IStudent extends Document {
  studentId: string;
  uuid: string;
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  department: string;
  grade: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  country: string;
  feeStatus: string;
  hostelAccess: boolean;
  transportAccess: boolean;
  hostelDetails?: string;
  routeDetails?: string;
  counsellorId?: string;
  openTickets: number;
  lastInteraction?: Date;
  enrollmentStatus: "Active" | "Pending" | "Suspended";
  schoolId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  parentId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema(
  {
    studentId: { type: String, required: true, unique: true },
    uuid: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    countryCode: { type: String, default: "+1" },
    department: { type: String },
    grade: { type: String },
    parentName: { type: String },
    parentPhone: { type: String },
    parentEmail: { type: String },
    country: { type: String },
    feeStatus: { type: String, default: "Pending" },
    hostelAccess: { type: Boolean, default: false },
    transportAccess: { type: Boolean, default: false },
    hostelDetails: { type: String },
    routeDetails: { type: String },
    counsellorId: { type: String },
    openTickets: { type: Number, default: 0 },
    lastInteraction: { type: Date },
    enrollmentStatus: { type: String, enum: ["Active", "Pending", "Suspended"], default: "Pending" },
    schoolId: { type: Schema.Types.ObjectId, ref: "School" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    parentId: { type: Schema.Types.ObjectId, ref: "Parent" },
  },
  { timestamps: true }
);

// Auto-generate student ID (e.g., STD1234) before saving if not provided
StudentSchema.pre("validate", async function (this: any) {
  if (!this.studentId) {
    const count = await mongoose.model("Student").countDocuments();
    this.studentId = `STD${1000 + count + 1}`;
  }
});

export default mongoose.models.Student || mongoose.model<IStudent>("Student", StudentSchema);
