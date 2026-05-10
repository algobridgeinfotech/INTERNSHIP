import mongoose, { Schema, Document } from "mongoose";

export interface ISchool extends Document {
  name: string;
  registrationNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  logoUrl?: string;
  adminId: mongoose.Types.ObjectId; // The primary admin for the school
  subscriptionPlan: "basic" | "premium" | "enterprise";
  subscriptionStatus: "active" | "trial" | "expired" | "cancelled";
  trialEndsAt?: Date;
  status: "active" | "inactive" | "suspended";
  createdAt: Date;
  updatedAt: Date;
}

const SchoolSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    website: { type: String },
    logoUrl: { type: String },
    adminId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    subscriptionPlan: { type: String, enum: ["basic", "premium", "enterprise"], default: "basic" },
    subscriptionStatus: { type: String, enum: ["active", "trial", "expired", "cancelled"], default: "trial" },
    trialEndsAt: { type: Date },
    status: { type: String, enum: ["active", "inactive", "suspended"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.models.School || mongoose.model<ISchool>("School", SchoolSchema);
