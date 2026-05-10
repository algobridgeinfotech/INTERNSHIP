import { Request, Response } from "express";
import Staff from "../models/Staff";
import User from "../models/User";
import bcrypt from "bcryptjs";
import fs from "fs";
import csv from "csv-parser";

// Helper to generate IDs
const generateID = (prefix: string) => `${prefix}-${Math.floor(10000 + Math.random() * 90000)}`;

export const bulkUploadStaff = async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
    }

    const schoolId = req.user?.schoolId || (req.body.schoolId as any);
    const results: any[] = [];

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
            try {
                let count = 0;
                for (const row of results) {
                    const tempPassword = row.password || "Welcome@123";
                    const hashedPwd = await bcrypt.hash(tempPassword, 10);
                    
                    const staffUser = new User({
                        name: row.name,
                        email: row.email,
                        password: hashedPwd,
                        role: row.systemRole || "SCHOOL_ADMIN",
                        schoolId: schoolId,
                        isFirstLogin: true,
                        customId: generateID("STF")
                    });
                    const savedStaffUser = await staffUser.save();

                    const staffMember = new Staff({
                        ...row,
                        staffId: staffUser.customId,
                        userId: savedStaffUser._id,
                        schoolId: schoolId,
                    });
                    await staffMember.save();
                    count++;
                }

                fs.unlinkSync(req.file!.path);
                res.status(201).json({ message: "Bulk upload successful", count });
            } catch (error) {
                res.status(500).json({ message: "Error saving staff records", error: (error as Error).message });
            }
        });
};

export const getStaff = async (req: Request, res: Response): Promise<void> => {
    try {
        const { role, department } = req.query;
        // @ts-ignore
        const schoolId = req.user.schoolId;
        const query: any = { schoolId };
        if (role) query.role = role;
        if (department) query.department = department;

        const staff = await Staff.find(query).sort({ createdAt: -1 });
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};

export const getStaffById = async (req: Request, res: Response): Promise<void> => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (!staff) {
            res.status(404).json({ message: "Staff not found" });
            return;
        }
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};

interface AuthRequest extends Request {
    user?: any;
}

export const createStaff = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { password, systemRole, ...profileData } = req.body;
        const schoolId = req.user?.schoolId || profileData.schoolId;

        const existingUser = await User.findOne({ email: profileData.email });
        if (existingUser) {
            res.status(400).json({ message: "A user with this email already exists" });
            return;
        }

        // Map designation to system roles
        const roleMap: Record<string, string> = {
            "Accountant": "ACCOUNTANT",
            "Librarian": "LIBRARIAN",
            "School Controller": "SCHOOL_CONTROLLER",
            "Receptionist": "SCHOOL_ADMIN",
            "Admin Staff": "SCHOOL_ADMIN"
        };

        const targetRole = systemRole || roleMap[profileData.designation] || "SCHOOL_ADMIN";
        const tempPassword = password || "Welcome@123";
        const hashedPwd = await bcrypt.hash(tempPassword, 10);
        
        const staffUser = new User({
            name: profileData.name,
            email: profileData.email,
            password: hashedPwd,
            role: targetRole,
            schoolId: schoolId,
            isFirstLogin: true,
            customId: generateID("STF")
        });
        const savedStaffUser = await staffUser.save();

        const staffMember = new Staff({
            ...profileData,
            staffId: staffUser.customId,
            role: profileData.designation || "Staff",
            userId: savedStaffUser._id,
            schoolId: schoolId,
        });
        const savedStaff = await staffMember.save();

        res.status(201).json({
            ...savedStaff.toObject(),
            tempPassword
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};

export const updateStaff = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedStaff) {
            res.status(404).json({ message: "Staff not found" });
            return;
        }
        res.json(updatedStaff);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};

export const deleteStaff = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
        if (!deletedStaff) {
            res.status(404).json({ message: "Staff not found" });
            return;
        }
        // Also delete user
        await User.findByIdAndDelete(deletedStaff.userId);
        res.json({ message: "Staff and associated user deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};
