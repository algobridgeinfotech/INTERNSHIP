import express from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware";
import { 
  getAllAdmins, 
  resetAdminPassword, 
  updateAdminStatus, 
  getActivityLogs 
} from "../controllers/superAdminController";
import { 
  getGlobalAnalytics 
} from "../controllers/analyticsController";
import { 
  getPlans, 
  createPlan, 
  getAllInvoices, 
  generateInvoice 
} from "../controllers/subscriptionController";
import { 
  getPermissions, 
  createPermission, 
  getRoles, 
  upsertRole 
} from "../controllers/permissionController";
import { 
  getContent, 
  updateContent, 
  getAllCMSContent 
} from "../controllers/cmsController";
import { 
  getHealthStatus, 
  getErrorLogs 
} from "../controllers/monitoringController";

import { UserRole } from "../utils/constants";

const router = express.Router();

// All routes here are PROTECTED and only for SUPER_ADMIN
router.use(protect);
router.use(authorizeRoles(UserRole.SUPER_ADMIN));

// Analytics
router.get("/analytics", getGlobalAnalytics);

// Admin Management
router.get("/admins", getAllAdmins);
router.post("/admins/reset-password", resetAdminPassword);
router.patch("/admins/:id/status", updateAdminStatus);

// RBAC
router.get("/permissions", getPermissions);
router.post("/permissions", createPermission);
router.get("/roles", getRoles);
router.post("/roles", upsertRole);

// Subscriptions & Billing
router.get("/subscriptions/plans", getPlans);
router.post("/subscriptions/plans", createPlan);
router.get("/subscriptions/invoices", getAllInvoices);
router.post("/subscriptions/generate-invoice", generateInvoice);

// CMS
router.get("/cms/all", getAllCMSContent);
router.post("/cms/update", updateContent);

// Monitoring
router.get("/monitoring/health", getHealthStatus);
router.get("/monitoring/errors", getErrorLogs);

// Activity Logs
router.get("/logs/activity", getActivityLogs);

export default router;
