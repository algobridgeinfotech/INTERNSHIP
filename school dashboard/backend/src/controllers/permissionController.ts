import { Request, Response } from "express";
import Role from "../models/Role";
import Permission from "../models/Permission";

// @route   GET /api/permissions
// @desc    Get all permissions
// @access  Private (Super Admin)
export const getPermissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const permissions = await Permission.find();
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// @route   POST /api/permissions
// @desc    Create a new permission
// @access  Private (Super Admin)
export const createPermission = async (req: Request, res: Response): Promise<void> => {
  try {
    const permission = await Permission.create(req.body);
    res.status(201).json(permission);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// @route   GET /api/roles
// @desc    Get all roles with permissions
// @access  Private (Super Admin)
export const getRoles = async (req: Request, res: Response): Promise<void> => {
  try {
    const roles = await Role.find().populate("permissions");
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// @route   POST /api/roles
// @desc    Create or update a role with permissions
// @access  Private (Super Admin)
export const upsertRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, slug, permissions, isSystem } = req.body;
    
    const role = await Role.findOneAndUpdate(
      { slug },
      { name, permissions, isSystem },
      { upsert: true, new: true }
    );
    
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
