import { Request, Response } from "express";
import School from "../models/School";
import User from "../models/User";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// @route   GET /api/schools
// @desc    Get all schools (Super Admin)
// @access  Private (Super Admin)
export const getSchools = async (req: Request, res: Response): Promise<void> => {
  try {
    const schools = await School.find().populate("adminId", "name email");
    res.json(schools);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// @route   POST /api/schools
// @desc    Create a new school & its primary admin
// @access  Private (Super Admin)
export const createSchool = async (req: Request, res: Response): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { 
      name, registrationNumber, address, city, state, country, zipCode, 
      contactEmail, contactPhone, adminName, adminEmail, adminPassword, subscriptionPlan 
    } = req.body;

    // Check if school exists
    const existingSchool = await School.findOne({ registrationNumber }).session(session);
    if (existingSchool) {
      res.status(400).json({ message: "School with this registration number already exists" });
      await session.abortTransaction();
      session.endSession();
      return;
    }

    // Check if admin email exists
    const existingAdmin = await User.findOne({ email: adminEmail }).session(session);
    if (existingAdmin) {
      res.status(400).json({ message: "Admin email already exists" });
      await session.abortTransaction();
      session.endSession();
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Create Admin User
    const newAdmin = new User({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      status: "active",
    });

    const savedAdmin = await newAdmin.save({ session });

    // Create School
    const newSchool = new School({
      name,
      registrationNumber,
      address,
      city,
      state,
      country,
      zipCode,
      contactEmail,
      contactPhone,
      adminId: savedAdmin._id,
      subscriptionPlan: subscriptionPlan || "basic",
      subscriptionStatus: "active",
      status: "active",
    });

    const savedSchool = await newSchool.save({ session });

    // Update Admin with School ID
    savedAdmin.schoolId = savedSchool._id as mongoose.Types.ObjectId;
    await savedAdmin.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(savedSchool);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// @route   PUT /api/schools/:id
// @desc    Update school
// @access  Private (Super Admin)
export const updateSchool = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedSchool = await School.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSchool) {
      res.status(404).json({ message: "School not found" });
      return;
    }
    res.json(updatedSchool);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// @route   DELETE /api/schools/:id
// @desc    Delete school and its associated admin
// @access  Private (Super Admin)
export const deleteSchool = async (req: Request, res: Response): Promise<void> => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      res.status(404).json({ message: "School not found" });
      return;
    }

    // Optionally delete admin or mark as inactive
    await User.findByIdAndDelete(school.adminId);
    await School.findByIdAndDelete(req.params.id);

    res.json({ message: "School and primary admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
