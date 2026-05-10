import mongoose, { Schema, Document } from "mongoose";

export interface IActivityLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: string; // 'create_school', 'delete_student', etc.
  module: string; // 'School Management', 'Student Management', etc.
  resourceId?: mongoose.Types.ObjectId;
  details?: string;
  ipAddress?: string;
  createdAt: Date;
}

const ActivityLogSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    module: { type: String, required: true },
    resourceId: { type: Schema.Types.ObjectId },
    details: { type: String },
    ipAddress: { type: String },
  },
  { timestamps: true, updatedAt: false }
);

export default mongoose.models.ActivityLog || mongoose.model<IActivityLog>("ActivityLog", ActivityLogSchema);
