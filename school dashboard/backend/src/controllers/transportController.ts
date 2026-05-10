import { Request, Response } from "express";
import Transport from "../models/Transport";

// @route   GET /api/admin/transport
// @desc    Get all transport routes/vehicles
export const getTransport = async (req: Request, res: Response) => {
  try {
    const schoolId = (req as any).user.schoolId;
    const transport = await Transport.find({ schoolId }).populate("assignedStudents", "name studentId grade");
    res.json(transport);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createTransport = async (req: Request, res: Response) => {
  try {
    const schoolId = (req as any).user.schoolId;
    const transport = await Transport.create({ ...req.body, schoolId });
    res.status(201).json(transport);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTransport = async (req: Request, res: Response) => {
  try {
    const transport = await Transport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(transport);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTransport = async (req: Request, res: Response) => {
  try {
    await Transport.findByIdAndDelete(req.params.id);
    res.json({ message: "Transport route deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const assignStudentToTransport = async (req: Request, res: Response) => {
  try {
    const { transportId, studentId } = req.body;
    const transport = await Transport.findByIdAndUpdate(
      transportId,
      { $addToSet: { assignedStudents: studentId } },
      { new: true }
    );
    res.json(transport);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentTransport = async (req: Request, res: Response) => {
    try {
        const studentId = req.query.studentId;
        const transport = await Transport.findOne({ 
            schoolId: (req as any).user.schoolId,
            assignedStudents: studentId 
        });
        res.json(transport);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
