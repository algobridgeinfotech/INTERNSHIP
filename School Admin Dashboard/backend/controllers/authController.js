import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import Teacher from "../models/Teacher.js";

const createToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

const safeUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role });

const migrateLegacyAdmin = async (email, password) => {
  const legacyAdmin = await Admin.findOne({ email });
  if (!legacyAdmin || !(await legacyAdmin.matchPassword(password))) return null;

  await User.collection.insertOne({
    name: legacyAdmin.name,
    email: legacyAdmin.email,
    password: legacyAdmin.password,
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date()
  });

  return User.findOne({ email: legacyAdmin.email });
};

export const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });

  if (exists) return res.status(409).json({ message: "User already exists" });

  const user = await User.create({ name, email, password, role: "admin" });
  res.status(201).json({ token: createToken(user), user: safeUser(user), admin: safeUser(user) });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });

  if (!user) user = await migrateLegacyAdmin(email, password);

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const profile = safeUser(user);
  const teacher = user.role === "teacher" ? await Teacher.findOne({ user: user._id }).select("subject assignedClass phone salary") : null;

  res.json({ token: createToken(user), user: { ...profile, teacher }, admin: profile });
};

export const getProfile = async (req, res) => {
  const teacher = req.user.role === "teacher" ? await Teacher.findOne({ user: req.user._id }).select("subject assignedClass phone salary") : null;
  res.json({ user: { ...safeUser(req.user), teacher }, admin: safeUser(req.user) });
};
