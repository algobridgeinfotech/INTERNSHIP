import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: { type: String, enum: ["Announcement", "Fee Reminder", "Holiday", "General"], default: "General" },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
