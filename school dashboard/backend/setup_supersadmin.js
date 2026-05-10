require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI;

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false },
  role: {
    type: String,
    required: true,
  },
  status: { type: String, enum: ["active", "inactive", "suspended"], default: "active" },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function createSuperAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    const email = "supersadmin@gmail.com";
    const password = "123456";

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update or create user
    const result = await User.findOneAndUpdate(
      { email },
      { 
        name: "Super Admin",
        email: email,
        password: hashedPassword,
        role: "super_admin",
        status: "active"
      },
      { upsert: true, new: true }
    );

    console.log("Super Admin user successfully created or updated:");
    console.log("Email:", result.email);
    console.log("Role:", result.role);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  } catch (error) {
    console.error("Error creating Super Admin:", error);
    process.exit(1);
  }
}

createSuperAdmin();
