import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    req.admin = user.role === "admin" ? user : undefined;
    next();
  } catch (_error) {
    res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

export const roleMiddleware = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Login required" });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "You do not have permission to access this feature" });
  }
  next();
};

export const adminOnly = roleMiddleware("admin");
export const teacherOnly = roleMiddleware("teacher");
