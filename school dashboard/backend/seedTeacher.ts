import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

// Models
import User from "./src/models/User";
import School from "./src/models/School";
import Class from "./src/models/Class";
import Subject from "./src/models/Subject";
import Student from "./src/models/Student";
import Staff from "./src/models/Staff";
import Timetable from "./src/models/Timetable";
import Notification from "./src/models/Notification";

dotenv.config();

const CLASSES = [
  { name: "9th", subjects: ["Mathematics", "Physics"] },
  { name: "10th", subjects: ["Mathematics", "Advanced Geometry"] },
  { name: "11th", subjects: ["Calculus", "Statistics"] }
];
const SECTIONS = ["A", "B"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const HASHED_PASS = "$2b$10$NK6nISvrfsZHDTqCPEMeG.Hv95Quklr0qytCmTVKXbSajAmDJHq5C"; // "123456"

async function seedTeacherData() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDB for Comprehensive Teacher Seeding...");

    // 1. Get/Create Primary School
    let school = await School.findOne({ name: "Springfield Academy" });
    if (!school) {
       school = await School.create({
         name: "Springfield Academy", registrationNumber: "REG-SPRING", address: "Delhi", city: "Delhi", state: "Delhi", country: "India", zipCode: "110001", contactEmail: "info@springfield.edu", contactPhone: "9876543210", status: "active", adminId: new mongoose.Types.ObjectId(), subscriptionPlan: "enterprise"
       });
    }

    // 2. Create a Dedicated Teacher User
    const teacherEmail = "teacher@gmail.com";
    const existingUser = await User.findOne({ email: teacherEmail });
    if (existingUser) {
       await Staff.deleteMany({ userId: existingUser._id });
       await User.deleteOne({ _id: existingUser._id });
    }
    
    await Staff.deleteMany({ staffId: "TCH-DOC-001" });

    const teacherUser = await User.create({
      name: "John Doe (Teacher)",
      email: teacherEmail,
      password: HASHED_PASS,
      role: "Teacher",
      schoolId: school._id,
      status: "active"
    });

    const teacherStaff = await Staff.create({
      userId: teacherUser._id,
      schoolId: school._id,
      staffId: "TCH-DOC-001",
      name: "John Doe",
      email: teacherEmail,
      jobTitle: "Senior Mathematics HOD",
      department: "Academics"
    });

    console.log("Teacher Account Re-Created: teacher@gmail.com / 123456");

    // 3. Create Classes & Subjects for this Teacher
    for (const clsItem of CLASSES) {
      const cls = await Class.findOneAndUpdate(
        { schoolId: school._id, name: clsItem.name },
        { sections: SECTIONS },
        { upsert: true, new: true }
      );

      // Assign multiple subjects to this teacher in each class
      for (const subName of clsItem.subjects) {
        await Subject.create({
          schoolId: school._id,
          name: subName,
          code: subName.substring(0, 4).toUpperCase() + "-" + clsItem.name,
          classId: cls._id,
          teacherId: teacherStaff._id
        });
      }

      // Create students for each section
      for (const section of SECTIONS) {
        for (let i = 0; i < 15; i++) {
           const stdUser = await User.create({ name: faker.person.fullName(), email: faker.internet.email(), role: "student", schoolId: school._id, status: "active" });
           await Student.create({ 
             schoolId: school._id, 
             userId: stdUser._id, 
             studentId: "STD-" + faker.string.numeric(5), 
             name: stdUser.name, 
             email: stdUser.email, 
             grade: cls.name, 
             classId: cls._id,
             section 
           });
        }
      }

      // Create Timetable slots
      for (const day of DAYS) {
        await Timetable.create({
          schoolId: school._id,
          classId: cls._id,
          section: "A",
          day,
          periods: [{
            startTime: "09:00 AM",
            endTime: "10:00 AM",
            subjectId: new mongoose.Types.ObjectId(),
            teacherId: teacherStaff._id,
            room: "Wing B-201"
          }]
        });
      }
    }

    console.log("✅ COMPREHENSIVE TEACHER DATA SEEDED SUCCESSFULLY!");
    console.log("Teacher assigned to: " + CLASSES.map(c => c.name).join(", "));
    process.exit(0);
  } catch (err) {
    console.error("Seed Failed:", err);
    process.exit(1);
  }
}

seedTeacherData();
