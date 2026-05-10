import mongoose, { Schema, Document } from "mongoose";

export interface IParent extends Document {
  parentId: string;
  userId: mongoose.Types.ObjectId;
  schoolId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  occupation?: string;
  address?: string;
  children: mongoose.Types.ObjectId[]; // Array of Student IDs
  createdAt: Date;
  updatedAt: Date;
}

const ParentSchema: Schema = new Schema(
  {
    parentId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    occupation: { type: String },
    address: { type: String },
    children: [{ type: Schema.Types.ObjectId, ref: "Student" }],
  },
  { timestamps: true }
);

// Auto-generate parent ID (e.g., PAR3045) before saving if not provided
ParentSchema.pre("validate", async function (this: any) {
  if (!this.parentId) {
    const count = await mongoose.model("Parent").countDocuments();
    this.parentId = `PAR${3000 + count + 1}`;
  }
});

export default mongoose.models.Parent || mongoose.model<IParent>("Parent", ParentSchema);
