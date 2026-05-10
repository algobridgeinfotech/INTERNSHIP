import ErrorLog from "../models/ErrorLog";

export const logError = async (
  message: string, 
  module: string, 
  options: { 
    level?: "error" | "warn" | "info"; 
    stack?: string; 
    requestPath?: string; 
    method?: string; 
    userId?: string;
  } = {}
) => {
  try {
    await ErrorLog.create({
      message,
      module,
      level: options.level || "error",
      stack: options.stack,
      requestPath: options.requestPath,
      method: options.method,
      userId: options.userId,
    });
    console.log(`[LOGGED ${options.level?.toUpperCase() || "ERROR"}]: ${message}`);
  } catch (err) {
    console.error("Failed to save error log to DB:", err);
  }
};
