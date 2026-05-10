import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

import { UserRole } from "../utils/constants";

export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role as UserRole)) {
      res.status(403).json({
        message: `Role (${req.user?.role}) is not allowed to access this resource.`,
      });
      return;
    }
    next();
  };
};

export const requireSchoolContext = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== UserRole.SUPER_ADMIN && !req.user?.schoolId) {
    res.status(403).json({
      message: "This action requires a school context.",
    });
    return;
  }
  next();
};
