import { Request, Response } from "express";
import mongoose from "mongoose";
import os from "os";
import ErrorLog from "../models/ErrorLog";

// @route   GET /api/superadmin/monitoring/health
// @desc    Get system health and monitoring data
// @access  Private (Super Admin)
export const getHealthStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    
    // Get DB Stats if connected
    let dbSize = "N/A";
    if (dbStatus === "connected") {
      const stats = await mongoose.connection.db!.command({ dbStats: 1 });
      dbSize = `${(stats.dataSize / (1024 ** 2)).toFixed(2)} MB`;
    }

    // Get server usage info
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const cpuUsage = os.loadavg();
    const uptime = os.uptime();
    
    res.json({
      database: {
        status: dbStatus,
        name: mongoose.connection.name,
        size: dbSize,
        backupStatus: "Synchronized", // Mocked for now
        lastBackup: new Date(Date.now() - 3600000).toISOString()
      },
      server: {
        platform: os.platform(),
        arch: os.arch(),
        uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
        cpuLoad: cpuUsage,
        memory: {
          total: `${(totalMem / (1024 ** 3)).toFixed(2)} GB`,
          used: `${(usedMem / (1024 ** 3)).toFixed(2)} GB`,
          free: `${(freeMem / (1024 ** 3)).toFixed(2)} GB`,
          percentUsed: `${((usedMem / totalMem) * 100).toFixed(2)}%`,
        }
      },
      api: {
        status: "online",
        version: "1.0.0",
        responseTime: "12ms" // Mocked
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// @route   GET /api/superadmin/monitoring/errors
// @desc    Get system error logs
// @access  Private (Super Admin)
export const getErrorLogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const logs = await ErrorLog.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("userId", "name email");
    
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
