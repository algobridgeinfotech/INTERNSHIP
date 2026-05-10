import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  schoolId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: "attendance" | "fee" | "exam" | "holiday" | "emergency" | "event";
  targetType: "all" | "class" | "individual";
  targetClassId?: mongoose.Types.ObjectId;
  targetUserId?: mongoose.Types.ObjectId;
  priority: "low" | "medium" | "high";
  status: "unread" | "read";
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["attendance", "fee", "exam", "holiday", "emergency", "event"], default: "event" },
  targetType: { type: String, enum: ["all", "class", "individual"], default: "all" },
  targetClassId: { type: Schema.Types.ObjectId, ref: "Class" },
  targetUserId: { type: Schema.Types.ObjectId, ref: "User" },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  status: { type: String, enum: ["unread", "read"], default: "unread" }
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);
