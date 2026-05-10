import { Request, Response } from "express";
import Subscription from "../models/Subscription";
import School from "../models/School";
import Invoice from "../models/Invoice";

// @route   GET /api/subscriptions/plans
// @desc    Get all subscription plans
// @access  Public/Private
export const getPlans = async (req: Request, res: Response): Promise<void> => {
  try {
    const plans = await Subscription.find({ status: "active" });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// @route   POST /api/subscriptions/plans
// @desc    Create a new plan
// @access  Private (Super Admin)
export const createPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const plan = await Subscription.create(req.body);
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// @route   GET /api/subscriptions/invoices
// @desc    Get all invoices
// @access  Private (Super Admin)
export const getAllInvoices = async (req: Request, res: Response): Promise<void> => {
  try {
    const invoices = await Invoice.find()
      .populate("schoolId", "name contactEmail")
      .populate("subscriptionId", "name")
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// @route   POST /api/subscriptions/generate-invoice
// @desc    Generate invoice for a school
// @access  Private (Super Admin)
export const generateInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { schoolId, subscriptionId, amount, dueDate } = req.body;
    
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const invoice = await Invoice.create({
      schoolId,
      subscriptionId,
      amount,
      dueDate,
      invoiceNumber,
      status: "unpaid"
    });
    
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
