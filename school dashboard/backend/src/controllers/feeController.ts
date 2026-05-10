import { Request, Response } from "express";
import Fee from "../models/Fee";

export const getFees = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore
    const schoolId = req.user.schoolId;
    const fees = await Fee.find({ schoolId }).populate("studentId", "name rollNumber class");
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

export const collectFee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, paymentMethod, transactionId } = req.body;
    const fee = await Fee.findById(req.params.id);
    
    if (!fee) {
      res.status(404).json({ message: "Fee record not found" });
      return;
    }

    fee.paidAmount += amount;
    if (fee.paidAmount >= fee.amount) {
      fee.status = "paid";
    } else if (fee.paidAmount > 0) {
      fee.status = "partially_paid";
    }

    fee.paymentMethod = paymentMethod;
    fee.transactionId = transactionId;
    
    await fee.save();
    res.json(fee);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
