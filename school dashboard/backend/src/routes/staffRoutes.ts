import express from "express";
import { getStaff, getStaffById, createStaff, updateStaff, deleteStaff, bulkUploadStaff } from "../controllers/staffController";
import upload from "../config/multer";

import { protect, authorizeRoles } from "../middlewares/authMiddleware";
import { UserRole, STAFF_ROLES } from "../utils/constants";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(authorizeRoles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, ...STAFF_ROLES), getStaff)
  .post(authorizeRoles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN), createStaff);

router.post("/bulk-upload", authorizeRoles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN), upload.single("file"), bulkUploadStaff);

router.route("/:id")
  .get(authorizeRoles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, ...STAFF_ROLES), getStaffById)
  .put(authorizeRoles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN), updateStaff)
  .delete(authorizeRoles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN), deleteStaff);

export default router;
