import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User";
import { generateTokens } from "../utils/generateToken";
import { sendEmail } from "../utils/email";

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Static Super Admin Check
        if (email === "superadmin@gmail.com" && password === "123456") {
            let sadmin = await User.findOne({ email }).select("+password");
            if (!sadmin) {
                const hashedPwd = await bcrypt.hash("123456", 10);
                sadmin = await User.create({
                    name: "Global Super Admin",
                    email: "superadmin@gmail.com",
                    password: hashedPwd,
                    role: "SUPER_ADMIN",
                    status: "active",
                    isFirstLogin: false,
                    customId: "SUPER-001"
                });
            }
            
            const { accessToken, refreshToken } = generateTokens(sadmin._id as any, "SUPER_ADMIN");
            
            // Save refresh token to user
            sadmin.refreshToken = refreshToken;
            await sadmin.save();

            res.json({
                _id: sadmin._id,
                name: sadmin.name,
                email: sadmin.email,
                role: "SUPER_ADMIN",
                token: accessToken,
                refreshToken: refreshToken,
                isFirstLogin: false
            });
            return;
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password as string);

        if (!isMatch) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        if (user.status !== "active") {
            res.status(403).json({ message: "User account is suspended or inactive" });
            return;
        }

        const { accessToken, refreshToken } = generateTokens(user._id as any, user.role);

        user.refreshToken = refreshToken;
        user.lastLogin = new Date();
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            schoolId: user.schoolId,
            avatar: user.avatar,
            isFirstLogin: user.isFirstLogin,
            token: accessToken,
            refreshToken: refreshToken
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
};

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body;
        await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Logout failed" });
    }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.body;
        if (!token) {
            res.status(401).json({ message: "Refresh token is required" });
            return;
        }

        const decoded = jwt.verify(token, (process.env.JWT_REFRESH_SECRET || "refresh_secret_fallback") as string) as any;
        const user = await User.findOne({ _id: decoded.id, refreshToken: token });

        if (!user) {
            res.status(401).json({ message: "Invalid refresh token" });
            return;
        }

        const tokens = generateTokens(user._id as any, user.role);
        user.refreshToken = tokens.refreshToken;
        await user.save();

        res.json({ token: tokens.accessToken, refreshToken: tokens.refreshToken });
    } catch (error) {
        res.status(401).json({ message: "Invalid refresh token" });
    }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        // In real app, save hashed version to DB with expiry
        // For now, we'll just simulate
        
        await sendEmail({
            email: user.email,
            subject: "Password Reset Request",
            message: `You requested a password reset. Your reset token is: ${resetToken}. In a real app, this would be a link.`
        });

        res.json({ message: "Password reset email sent" });
    } catch (error) {
        res.status(500).json({ message: "Error sending email" });
    }
};

export const setupPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { newPassword } = req.body;
        // @ts-ignore
        const userId = req.user._id;

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(userId, {
            password: hashedPassword,
            isFirstLogin: false,
            emailVerified: true // Assume verified if they could set password via onboarding
        });

        res.json({ message: "Password setup successful" });
    } catch (error) {
        res.status(500).json({ message: "Failed to setup password" });
    }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    // @ts-ignore
    const user = req.user;
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json(user);
};
