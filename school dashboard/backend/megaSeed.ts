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
import Attendance from "./src/models/Attendance";
import Exam from "./src/models/Exam";
import Fee from "./src/models/Fee";
import Payroll from "./src/models/Payroll";
import Transport from "./src/models/Transport";
import Notification from "./src/models/Notification";
import CMSContent from "./src/models/CMSContent";
import Timetable from "./src/models/Timetable";
import Parent from "./src/models/Parent";
import { UserRole } from "./src/utils/constants";

dotenv.config();

const CLASSES = ["Nursery", "LKG", "UKG", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];
const SECTIONS = ["A", "B", "C"];
const SUBJECTS = ["English", "Mathematics", "Science", "Social Science", "Hindi", "Computer", "Physics", "Chemistry", "Biology", "Commerce", "Economics", "Accountancy"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const STAFF_ROLES = ["Accountant", "Librarian", "School Controller", "Receptionist", "Transport Staff", "HR Staff"];

const HASHED_PASS = "$2b$10$NK6nISvrfsZHDTqCPEMeG.Hv95Quklr0qytCmTVKXbSajAmDJHq5C"; // "123456"

async function megaSeed() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDB for Production-Grade Mega Seeding...");

    // Clear everything
    const collections = [User, School, Class, Subject, Student, Staff, Attendance, Exam, Fee, Payroll, Transport, Notification, CMSContent, Timetable];
    for (const model of collections) {
      await model.deleteMany({});
    }

    // 1. Super Admin
    await User.create({ 
        name: "Platform Super Admin", 
        email: "superadmin@gmail.com", 
        password: HASHED_PASS, 
        role: UserRole.SUPER_ADMIN,
        isFirstLogin: false,
        customId: "SUPER-001"
    });

    // 2. Schools & Admin
    const tempAdminId = new mongoose.Types.ObjectId();
    const school = await School.create({
      name: "Springfield Academy",
      registrationNumber: "REG-SPRING-2026",
      address: "123 Education Lane, Sector 12",
      city: "Delhi",
      state: "Delhi",
      country: "India",
      zipCode: "110001",
      contactEmail: "info@springfield.edu",
      contactPhone: "9876543210",
      status: "active",
      subscriptionPlan: "enterprise",
      adminId: tempAdminId
    });

    const admin = await User.create({
      _id: tempAdminId,
      name: "Springfield Principal",
      email: "schooladmin@gmail.com",
      password: HASHED_PASS,
      role: UserRole.SCHOOL_ADMIN,
      schoolId: school._id,
      isFirstLogin: false,
      customId: "ADM-101"
    });
    school.adminId = admin._id;
    await school.save();

    // 3. Classes & Subjects
    console.log("Generating Classes & Subjects...");
    const createdClasses = [];
    for (const className of CLASSES) {
      const cls = await Class.create({ schoolId: school._id, name: className, sections: SECTIONS });
      createdClasses.push(cls);
      for (const subName of SUBJECTS) {
        await Subject.create({ 
            schoolId: school._id, 
            name: subName, 
            code: subName.substring(0, 3).toUpperCase() + "-" + className.substring(0, 2).toUpperCase(), 
            classId: cls._id 
        });
      }
    }

    // 4. Specialized Staff
    console.log("Onboarding Specialized Staff...");
    const roleMapping: Record<string, UserRole> = {
        "Accountant": UserRole.ACCOUNTANT,
        "Librarian": UserRole.LIBRARIAN,
        "School Controller": UserRole.SCHOOL_CONTROLLER,
        "Receptionist": UserRole.SCHOOL_ADMIN,
        "Transport Staff": UserRole.SCHOOL_ADMIN,
        "HR Staff": UserRole.SCHOOL_ADMIN
    };

    for (const role of STAFF_ROLES) {
        const email = role.toLowerCase().replace(" ", "") + "@gmail.com";
        const systemRole = roleMapping[role] || UserRole.SCHOOL_ADMIN;
        const user = await User.create({
            name: faker.person.fullName() + ` (${role})`,
            email,
            password: HASHED_PASS,
            role: systemRole,
            schoolId: school._id,
            isFirstLogin: false,
            customId: `STF-${Math.floor(1000 + Math.random() * 9000)}`
        });
        await Staff.create({
            userId: user._id,
            schoolId: school._id,
            staffId: user.customId,
            name: user.name,
            email: user.email,
            jobTitle: role,
            department: role.includes("Accountant") ? "Finance" : role.includes("Librarian") ? "Library" : "Administration",
            role: role
        });
    }

    // 5. Teachers
    console.log("Generating Faculty...");
    const teachers = [];
    for (let i = 0; i < 20; i++) {
        const email = `teacher${i+1}@gmail.com`;
        const user = await User.create({
            name: faker.person.fullName(),
            email,
            password: HASHED_PASS,
            role: UserRole.TEACHER,
            schoolId: school._id,
            isFirstLogin: false,
            customId: `TCH-${1000+i}`
        });
        const stf = await Staff.create({
            userId: user._id,
            schoolId: school._id,
            staffId: user.customId,
            name: user.name,
            email: user.email,
            jobTitle: "Senior Teacher",
            department: "Academics",
            role: "Teacher"
        });
        teachers.push(stf);

        // Assign to random subjects
        const randomSubs = await Subject.find({ schoolId: school._id }).limit(3);
        for(const sub of randomSubs) {
            sub.teacherId = stf._id;
            await sub.save();
        }
    }

    // 6. Parents & Students
    console.log("Connecting Families...");
    for (let i = 0; i < 50; i++) {
        const parentEmail = `parent${i+1}@gmail.com`;
        const parentUser = await User.create({
            name: faker.person.fullName() + " (Parent)",
            email: parentEmail,
            password: HASHED_PASS,
            role: UserRole.PARENT,
            schoolId: school._id,
            isFirstLogin: false,
            customId: `PRT-${3000+i}`
        });

        const parent = await Parent.create({
            userId: parentUser._id,
            schoolId: school._id,
            parentId: parentUser.customId,
            name: parentUser.name,
            email: parentUser.email,
            phone: faker.phone.number(),
            children: []
        });

        // 1-2 children per parent
        const childrenCount = faker.number.int({ min: 1, max: 2 });
        for (let j = 0; j < childrenCount; j++) {
            const studentEmail = `student${i*2 + j + 1}@gmail.com`;
            const studentUser = await User.create({
                name: faker.person.fullName(),
                email: studentEmail,
                password: HASHED_PASS,
                role: UserRole.STUDENT,
                schoolId: school._id,
                isFirstLogin: false,
                customId: `STD-${202600 + (i*2+j)}`
            });

            const cls = faker.helpers.arrayElement(createdClasses);
            const student = await Student.create({
                schoolId: school._id,
                userId: studentUser._id,
                studentId: studentUser.customId,
                parentId: parent._id,
                name: studentUser.name,
                email: studentUser.email,
                classId: cls._id,
                section: "A",
                grade: cls.name,
                parentEmail: parentUser.email,
                parentName: parentUser.name,
                enrollmentStatus: "Active"
            });

            parent.children.push(student._id as any);
            await parent.save();
        }
    }

    // 7. Timetables (Approved)
    console.log("Generating Approved Timetables...");
    const sampleClasses = createdClasses.slice(0, 3);
    for (const cls of sampleClasses) {
        for (const day of DAYS) {
            const periods = [];
            for (let p = 1; p <= 5; p++) {
                const sub = faker.helpers.arrayElement(await Subject.find({ classId: cls._id }));
                const tch = faker.helpers.arrayElement(teachers);
                periods.push({
                    startTime: `${8+p}:00 AM`,
                    endTime: `${8+p}:45 AM`,
                    subjectId: sub?._id || new mongoose.Types.ObjectId(),
                    teacherId: tch._id,
                    room: `R-${p}0${faker.number.int({min:1, max:5})}`
                });
            }
            await Timetable.create({
                schoolId: school._id,
                classId: cls._id,
                section: "A",
                day,
                periods,
                status: "approved",
                approvedBy: admin._id
            });
        }
    }

    console.log("✅ PRODUCTION-GRADE MEGA SEED COMPLETE!");
    console.log("------------------------------------------");
    console.log("Super Admin: superadmin@gmail.com / 123456");
    console.log("School Admin: schooladmin@gmail.com / 123456");
    console.log("Accountant: accountant@gmail.com / 123456");
    console.log("Librarian: librarian@gmail.com / 123456");
    console.log("Controller: schoolcontroller@gmail.com / 123456");
    console.log("Teacher: teacher1@gmail.com / 123456");
    console.log("Student: student1@gmail.com / 123456");
    console.log("Parent: parent1@gmail.com / 123456");
    console.log("------------------------------------------");
    
    process.exit(0);
  } catch (err) {
    console.error("Seed Failed:", err);
    process.exit(1);
  }
}

megaSeed();
