import mongoose from "mongoose";
import User from "./src/models/User";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDB for seeding...");

    const existingAdmin = await User.findOne({ email: "superadmin@gmail.com" });
    if (existingAdmin) {
      console.log("Super Admin already exists. Updating password to 123456...");
      const salt = await bcrypt.genSalt(10);
      existingAdmin.password = await bcrypt.hash("123456", salt);
      existingAdmin.role = "super_admin";
      existingAdmin.status = "active";
      await existingAdmin.save();
    } else {
      console.log("Creating Super Admin...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("123456", salt);
      
      await User.create({
        name: "Platform Super Admin",
        email: "superadmin@gmail.com",
        password: hashedPassword,
        role: "super_admin",
        status: "active",
      });
      console.log("Super Admin created successfully!");
    }
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedSuperAdmin();
