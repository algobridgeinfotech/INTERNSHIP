import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import feeRoutes from "./routes/feeRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import examRoutes from "./routes/examRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import timetableRoutes from "./routes/timetableRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.json({ message: "Student Management API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", examRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/reports", reportRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
