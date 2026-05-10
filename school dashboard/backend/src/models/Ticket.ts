import mongoose, { Schema, Document } from "mongoose";

export interface ITicket extends Document {
  ticketId: string;
  title: string;
  description: string;
  requesterId: mongoose.Types.ObjectId;
  department: string;
  priority: "low" | "medium" | "high" | "urgent";
  severity: "1" | "2" | "3" | "4";
  category: string;
  assignedTo?: mongoose.Types.ObjectId;
  status: "open" | "in_progress" | "waiting_on_requester" | "resolved" | "closed";
  slaStatus: "within_sla" | "breached" | "near_breach";
  resolutionETA?: Date;
  attachments: string[];
  schoolId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema: Schema = new Schema(
  {
    ticketId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    requesterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    department: { type: String, required: true },
    priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
    severity: { type: String, enum: ["1", "2", "3", "4"], default: "3" },
    category: { type: String, required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["open", "in_progress", "waiting_on_requester", "resolved", "closed"],
      default: "open",
    },
    slaStatus: { type: String, enum: ["within_sla", "breached", "near_breach"], default: "within_sla" },
    resolutionETA: { type: Date },
    attachments: [{ type: String }],
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
  },
  { timestamps: true }
);

// Auto-generate ticket ID before saving
TicketSchema.pre("validate", function (this: any) {
  if (!this.ticketId) {
    this.ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
  }
});

export default mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", TicketSchema);
