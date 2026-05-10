import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token received, verifying...");

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as { id: string, role: string };
      console.log("Token verified for user ID:", decoded.id);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        console.warn("User not found in DB for ID:", decoded.id);
        res.status(401).json({ message: "Not authorized, user not found" });
        return;
      }

      if (user.status !== "active") {
        console.warn("User account inactive:", user.email);
        res.status(401).json({ message: "Not authorized, user account is not active" });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("JWT Verification Error:", (error as Error).message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.warn("No Authorization header found");
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized, user not found" });
      return;
    }

    // SUPER_ADMIN has full access to everything
    if (req.user.role === "SUPER_ADMIN") {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: `User role ${req.user.role} is not authorized to access this route` });
      return;
    }
    next();
  };
};

export const authorizeRoles = authorize;
