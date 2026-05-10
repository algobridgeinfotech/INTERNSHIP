import mongoose, { Schema, Document } from "mongoose";

export interface IErrorLog extends Document {
  level: "error" | "warn" | "info";
  message: string;
  module: string;
  stack?: string;
  requestPath?: string;
  method?: string;
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ErrorLogSchema: Schema = new Schema(
  {
    level: { type: String, enum: ["error", "warn", "info"], default: "error" },
    message: { type: String, required: true },
    module: { type: String, required: true },
    stack: { type: String },
    requestPath: { type: String },
    method: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.ErrorLog || mongoose.model<IErrorLog>("ErrorLog", ErrorLogSchema);
