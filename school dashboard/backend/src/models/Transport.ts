import mongoose, { Schema, Document } from "mongoose";

export interface ITransport extends Document {
  schoolId: mongoose.Types.ObjectId;
  routeName: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  status: "active" | "inactive";
  stops: { name: string; time: string }[];
  assignedStudents: mongoose.Types.ObjectId[];
}

const TransportSchema: Schema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true, index: true },
  routeName: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  driverName: { type: String, required: true },
  driverPhone: { type: String, required: true },
  capacity: { type: Number, required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  stops: [{ name: String, time: String }],
  assignedStudents: [{ type: Schema.Types.ObjectId, ref: "Student" }],
}, { timestamps: true });

export default mongoose.models.Transport || mongoose.model<ITransport>("Transport", TransportSchema);
