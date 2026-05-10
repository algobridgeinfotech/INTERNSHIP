import mongoose, { Schema, Document } from "mongoose";

import { UserRole } from "../utils/constants";


export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    customId: string; // Unique ID like ADM-101, TCH-202
    schoolId?: mongoose.Types.ObjectId;
    status: "active" | "inactive" | "suspended";
    avatar?: string;
    refreshToken?: string;
    lastLogin?: Date;
    isFirstLogin: boolean;
    phone?: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    twoFactorEnabled?: boolean;
    twoFactorSecret?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, select: false },
        role: {
            type: String,
            required: true,
            enum: [
                "SUPER_ADMIN", 
                "SCHOOL_ADMIN", 
                "TEACHER", 
                "ACCOUNTANT", 
                "LIBRARIAN", 
                "SCHOOL_CONTROLLER", 
                "STUDENT", 
                "PARENT"
            ],
            index: true
        },
        customId: { type: String, unique: true, sparse: true },
        schoolId: { type: Schema.Types.ObjectId, ref: "School" },
        status: { type: String, enum: ["active", "inactive", "suspended"], default: "active" },
        avatar: { type: String },
        refreshToken: { type: String, select: false },
        lastLogin: { type: Date },
        isFirstLogin: { type: Boolean, default: true },
        phone: { type: String },
        emailVerified: { type: Boolean, default: false },
        phoneVerified: { type: Boolean, default: false },
        twoFactorEnabled: { type: Boolean, default: false },
        twoFactorSecret: { type: String, select: false },
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
