import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

// Models
import User from "./src/models/User";
import School from "./src/models/School";
import Staff from "./src/models/Staff";

dotenv.config();

const STAFF_ROLES = [
    "Accountant", "Librarian", "School Controller",
    "Receptionist", "HR Staff", "Transport Staff"
];

const HASHED_PASS = "$2b$10$NK6nISvrfsZHDTqCPEMeG.Hv95Quklr0qytCmTVKXbSajAmDJHq5C"; // "123456"

async function seedEnterpriseStaff() {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("Connected to MongoDB for Enterprise Staff Seeding...");

        const school = await School.findOne({ name: "Springfield Academy" });
        if (!school) {
            console.error("School not found. Run seedTeacher first.");
            process.exit(1);
        }

        for (const role of STAFF_ROLES) {
            const email = role.toLowerCase().replace(' ', '') + "@gmail.com";

            // Cleanup existing
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                await Staff.deleteMany({ userId: existingUser._id });
                await User.deleteOne({ _id: existingUser._id });
            }

            const user = await User.create({
                name: faker.person.fullName() + ` (${role})`,
                email,
                password: HASHED_PASS,
                role: role,
                schoolId: school._id,
                status: "active"
            });

            await Staff.create({
                userId: user._id,
                schoolId: school._id,
                staffId: "STF-" + faker.string.numeric(5),
                name: user.name,
                email: user.email,
                role: role,
                department: role.includes("Transport") ? "Logistics" : role.includes("Accountant") ? "Finance" : "Operations",
                status: "online",
                attendanceStatus: "present",
                phone: faker.phone.number(),
                jobTitle: role === "Accountant" ? "Chief Financial Officer" : `Senior ${role}`
            });

            console.log(`✅ Seeded ${role}: ${email} / 123456`);
        }

        console.log("✅ ENTERPRISE STAFF SEEDED SUCCESSFULLY!");
        process.exit(0);
    } catch (err) {
        console.error("Seed Failed:", err);
        process.exit(1);
    }
}

seedEnterpriseStaff();
