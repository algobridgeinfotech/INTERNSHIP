import express from "express";
import { getSchools, createSchool, updateSchool, deleteSchool } from "../controllers/schoolController";
import { protect, authorize } from "../middlewares/authMiddleware";

const router = express.Router();

router.use(protect);
router.use(authorize("SUPER_ADMIN")); // Only super admin can access these globally for now

router.route("/")
  .get(getSchools)
  .post(createSchool);

router.route("/:id")
  .put(updateSchool)
  .delete(deleteSchool);

export default router;
