import mongoose from "mongoose";
import User from "./src/models/User";
import School from "./src/models/School";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const seedSchoolAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    
    const adminEmail = "schooladmin@gmail.com";
    const pass = "123456";

    // 1. Create User first (need adminId for School)
    await User.deleteMany({ email: adminEmail });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pass, salt);

    const tempAdminId = new mongoose.Types.ObjectId();

    let school = await School.findOne();
    if (!school) {
      school = await School.create({
        name: "Springfield Academy",
        registrationNumber: "REG-" + Date.now(),
        address: "123 Education Lane",
        city: "Springfield",
        state: "Illinois",
        country: "USA",
        zipCode: "62704",
        contactEmail: "info@springfield.edu",
        contactPhone: "555-0123",
        adminId: tempAdminId,
        status: "active"
      });
      console.log("Created test school:", school.name);
    }

    const newUser = await User.create({
      _id: tempAdminId,
      name: "Springfield Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "Admin", 
      schoolId: school._id,
      status: "active",
    });

    // Update school adminId just in case
    school.adminId = newUser._id;
    await school.save();

    console.log("✅ School Admin created successfully!");
    console.log("Credentials:", {
      email: adminEmail,
      password: pass,
      schoolId: school._id
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedSchoolAdmin();
