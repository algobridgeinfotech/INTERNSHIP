import mongoose, { Schema, Document } from "mongoose";

export interface ISubscription extends Document {
  name: string;
  slug: string; // 'basic', 'standard', 'premium', 'enterprise'
  price: number;
  billingCycle: "monthly" | "yearly";
  features: string[];
  maxStudents: number;
  maxStaff: number;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    billingCycle: { type: String, enum: ["monthly", "yearly"], required: true },
    features: [{ type: String }],
    maxStudents: { type: Number, default: 0 }, // 0 for unlimited
    maxStaff: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.models.Subscription || mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
