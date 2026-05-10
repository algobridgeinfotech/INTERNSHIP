import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export const generateTokens = (userId: Types.ObjectId, role: string) => {
  const accessToken = jwt.sign(
    { id: userId, role },
    (process.env.JWT_SECRET || "fallback_secret") as string,
    { expiresIn: "1h" } // Access token expires in 1 hour
  );

  const refreshToken = jwt.sign(
    { id: userId },
    (process.env.JWT_REFRESH_SECRET || "refresh_secret_fallback") as string,
    { expiresIn: "7d" } // Refresh token expires in 7 days
  );

  return { accessToken, refreshToken };
};
