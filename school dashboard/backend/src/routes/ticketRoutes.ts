import express from "express";
import { getTickets, createTicket, updateTicketStatus } from "../controllers/ticketController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

import { requireSchoolContext } from "../middlewares/rbacMiddleware";

router.use(protect);
router.use(requireSchoolContext);

router.route("/")
  .get(getTickets)
  .post(createTicket);

router.route("/:id/status")
  .put(updateTicketStatus);

export default router;
