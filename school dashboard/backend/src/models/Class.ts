import mongoose, { Schema, Document } from "mongoose";

export interface IClass extends Document {
  schoolId: mongoose.Types.ObjectId;
  name: string; // e.g. "Grade 10"
  sections: string[]; // ["A", "B", "C"]
  classTeacherId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ClassSchema: Schema = new Schema({
  schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
  name: { type: String, required: true },
  sections: [{ type: String }],
  classTeacherId: { type: Schema.Types.ObjectId, ref: "Staff" }
}, { timestamps: true });

export default mongoose.models.Class || mongoose.model<IClass>("Class", ClassSchema);
