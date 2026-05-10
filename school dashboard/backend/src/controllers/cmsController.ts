import { Request, Response } from "express";
import CMSContent from "../models/CMSContent";

// @route   GET /api/cms/content/:key
// @desc    Get CMS content by key
// @access  Public
export const getContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const content = await CMSContent.findOne({ key: req.params.key });
    if (!content) {
      res.status(404).json({ message: "Content not found" });
      return;
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// @route   POST /api/cms/content
// @desc    Update or create CMS content
// @access  Private (Super Admin)
export const updateContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { key, value, type, module } = req.body;
    
    const content = await CMSContent.findOneAndUpdate(
      { key },
      { 
        value, 
        type, 
        module, 
        lastUpdatedBy: (req as any).user._id 
      },
      { upsert: true, new: true }
    );
    
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// @route   GET /api/cms/all
// @desc    Get all CMS content
// @access  Private (Super Admin)
export const getAllCMSContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const contents = await CMSContent.find().populate("lastUpdatedBy", "name");
    res.json(contents);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
