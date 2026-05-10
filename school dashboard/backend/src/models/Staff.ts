import mongoose, { Schema, Document } from "mongoose";

export interface IStaff extends Document {
  staffId: string;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  businessUnit: string;
  subDepartment: string;
  location: string;
  costCenter: string;
  reportingManager: string;
  managerEmail: string;
  managerDepartment: string;
  role: string;
  status: "online" | "offline";
  attendanceStatus: "present" | "absent" | "on_leave" | "half_day";
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  schoolId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const StaffSchema = new Schema(
  {
    staffId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    jobTitle: { type: String },
    department: { type: String },
    businessUnit: { type: String },
    subDepartment: { type: String },
    location: { type: String },
    costCenter: { type: String },
    reportingManager: { type: String },
    managerEmail: { type: String },
    managerDepartment: { type: String },
    role: { type: String, default: "Staff" },
    status: { type: String, enum: ["online", "offline"], default: "offline" },
    attendanceStatus: { type: String, enum: ["present", "absent", "on_leave", "half_day"], default: "absent" },
    emergencyContactName: { type: String },
    emergencyContactPhone: { type: String },
    emergencyContactRelation: { type: String },
    schoolId: { type: Schema.Types.ObjectId, ref: "School" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Auto-generate staff ID (e.g., STF2045) before saving if not provided
StaffSchema.pre("validate", async function (this: any) {
  if (!this.staffId) {
    const count = await mongoose.model("Staff").countDocuments();
    this.staffId = `STF${2000 + count + 1}`;
  }
});

export default mongoose.models.Staff || mongoose.model<IStaff>("Staff", StaffSchema);
