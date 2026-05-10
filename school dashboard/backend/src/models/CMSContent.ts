import mongoose, { Schema, Document } from "mongoose";

export interface ICMSContent extends Document {
  key: string; // e.g., 'homepage.hero.title'
  value: any;
  type: "text" | "image" | "html" | "json";
  module: string; // 'Landing Page', 'Dashboard', etc.
  lastUpdatedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CMSContentSchema: Schema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
    type: { type: String, enum: ["text", "image", "html", "json"], required: true },
    module: { type: String, required: true },
    lastUpdatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.CMSContent || mongoose.model<ICMSContent>("CMSContent", CMSContentSchema);
