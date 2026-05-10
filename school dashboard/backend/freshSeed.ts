import mongoose from "mongoose";
import User from "./src/models/User";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const cleanAndSeed = async () => {
  try {
    console.log("Connecting to:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI!);
    
    const email = "superadmin@gmail.com";
    const pass = "123456";

    console.log(`Deleting existing user with email: ${email}...`);
    await User.deleteMany({ email });

    console.log("Creating fresh Super Admin...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pass, salt);

    const newUser = await User.create({
      name: "Platform Super Admin",
      email: email,
      password: hashedPassword,
      role: "super_admin",
      status: "active",
    });

    console.log("✅ Super Admin created successfully in 'school_erp' database!");
    console.log("User details:", {
      id: newUser._id,
      email: newUser.email,
      role: newUser.role
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

cleanAndSeed();
