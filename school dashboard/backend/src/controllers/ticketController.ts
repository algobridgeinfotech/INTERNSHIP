import { Request, Response } from "express";
import Ticket from "../models/Ticket";

export const getTickets = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore
    const schoolId = req.user.schoolId;
    // @ts-ignore
    const role = req.user.role;
    // @ts-ignore
    const userId = req.user._id;

    let query: any = { schoolId };

    // If student or parent, only see their own tickets
    if (role === "student" || role === "parent") {
      query.requesterId = userId;
    }

    const tickets = await Ticket.find(query)
      .populate("requesterId", "name email avatar")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

export const createTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, department, priority, category } = req.body;
    // @ts-ignore
    const schoolId = req.user.schoolId;
    // @ts-ignore
    const requesterId = req.user._id;

    // SLA logic placeholder (e.g. urgent = 2 hours)
    const resolutionETA = new Date();
    resolutionETA.setHours(resolutionETA.getHours() + (priority === "urgent" ? 2 : 24));

    const ticket = new Ticket({
      title,
      description,
      department,
      priority,
      category,
      schoolId,
      requesterId,
      resolutionETA,
    });

    const savedTicket = await ticket.save();
    res.status(201).json(savedTicket);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

export const updateTicketStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, assignedTo } = req.body;
    
    // @ts-ignore
    const schoolId = req.user.schoolId;

    const ticket = await Ticket.findOne({ _id: id, schoolId });
    if (!ticket) {
      res.status(404).json({ message: "Ticket not found" });
      return;
    }

    if (status) ticket.status = status;
    if (assignedTo) ticket.assignedTo = assignedTo;

    const updatedTicket = await ticket.save();
    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
