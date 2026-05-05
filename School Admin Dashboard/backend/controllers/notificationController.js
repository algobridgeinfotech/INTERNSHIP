import Notification from "../models/Notification.js";

export const createNotification = async (req, res) => {
  const notification = await Notification.create(req.body);
  res.status(201).json(notification);
};

export const getNotifications = async (_req, res) => {
  const notifications = await Notification.find().sort({ date: -1, createdAt: -1 });
  res.json(notifications);
};

export const deleteNotification = async (req, res) => {
  const notification = await Notification.findByIdAndDelete(req.params.id);
  if (!notification) return res.status(404).json({ message: "Notification not found" });
  res.json({ message: "Notification deleted" });
};
