import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { connectDB } from "./config/db";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

import authRoutes from "./routes/authRoutes";
import ticketRoutes from "./routes/ticketRoutes";
import studentRoutes from "./routes/studentRoutes";
import staffRoutes from "./routes/staffRoutes";
import schoolRoutes from "./routes/schoolRoutes";
import superAdminRoutes from "./routes/superAdminRoutes";
import adminRoutes from "./routes/adminRoutes";
import teacherRoutes from "./routes/teacherRoutes";
import timetableRoutes from "./routes/timetableRoutes";
import parentRoutes from "./routes/parentRoutes";
import notificationRoutes from "./routes/notificationRoutes";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:5173", // Vite default
];

app.use(
  cors({
    origin: true, // Allow all origins in development
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/superadmin", superAdminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/parent", parentRoutes);
app.use("/api/notifications", notificationRoutes);

// Database connection
connectDB();

// Socket.io integration
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
  
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

// Basic Route
app.get("/api/health", (req, res) => {
  res.json({ status: "success", message: "API is running smoothly." });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
