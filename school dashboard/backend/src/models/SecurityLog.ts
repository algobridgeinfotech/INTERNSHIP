import mongoose, { Schema, Document } from "mongoose";

export interface ISecurityLog extends Document {
  userId: mongoose.Types.ObjectId;
  event: string; // 'login', 'failed_login', 'logout', 'password_change', '2fa_enabled'
  ipAddress: string;
  userAgent: string;
  device?: string;
  location?: string;
  status: "success" | "failure";
  metadata?: any;
  createdAt: Date;
}

const SecurityLogSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: String, required: true },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    device: { type: String },
    location: { type: String },
    status: { type: String, enum: ["success", "failure"], required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true, updatedAt: false }
);

export default mongoose.models.SecurityLog || mongoose.model<ISecurityLog>("SecurityLog", SecurityLogSchema);
