import { Request, Response } from "express";
import Exam from "../models/Exam";

export const getExams = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore
    const schoolId = req.user.schoolId;
    const exams = await Exam.find({ schoolId }).sort({ startDate: 1 });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

export const createExam = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore
    const schoolId = req.user.schoolId;
    const exam = new Exam({ ...req.body, schoolId });
    await exam.save();
    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

export const updateExamStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const exam = await Exam.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
