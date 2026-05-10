import mongoose, { Schema, Document } from "mongoose";

export interface IRole extends Document {
  name: string;
  slug: string; // e.g., 'super_admin'
  permissions: mongoose.Types.ObjectId[];
  isSystem?: boolean; // System roles cannot be deleted
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    permissions: [{ type: Schema.Types.ObjectId, ref: "Permission" }],
    isSystem: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Role || mongoose.model<IRole>("Role", RoleSchema);
