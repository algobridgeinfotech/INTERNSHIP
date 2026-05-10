import { Request, Response } from "express";
import Notification from "../models/Notification";

// @route   GET /api/admin/notifications
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const schoolId = (req as any).user.schoolId;
    const notifications = await Notification.find({ schoolId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @route   POST /api/admin/notifications
export const sendNotification = async (req: Request, res: Response) => {
  try {
    const schoolId = (req as any).user.schoolId;
    const notification = await Notification.create({ ...req.body, schoolId });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
import Student from "../models/Student";

export const getMyNotifications = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const schoolId = user.schoolId;
        
        let query: any = { schoolId, $or: [{ targetType: "all" }] };

        if (user.role === "STUDENT") {
            const student = await Student.findOne({ userId: user._id });
            if (student) {
                query.$or.push(
                    { targetType: "class", targetClassId: student.classId },
                    { targetType: "individual", targetUserId: user._id }
                );
            }
        } else if (user.role === "PARENT") {
            // Parents get 'all' plus individual if targeted
            query.$or.push({ targetType: "individual", targetUserId: user._id });
        } else if (["TEACHER", "ACCOUNTANT", "LIBRARIAN", "SCHOOL_CONTROLLER"].includes(user.role)) {
             query.$or.push({ targetType: "individual", targetUserId: user._id });
        }

        const notifications = await Notification.find(query).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
