import mongoose, { Schema, Document } from "mongoose";

export interface IPermission extends Document {
  name: string;
  slug: string; // e.g., 'manage_students'
  description?: string;
  module: string; // e.g., 'Academics'
  createdAt: Date;
  updatedAt: Date;
}

const PermissionSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    module: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Permission || mongoose.model<IPermission>("Permission", PermissionSchema);
