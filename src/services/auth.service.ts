import jwt from "jsonwebtoken";
import User, { UserRole } from "../models/User";

const generateToken = (userId: string, role: UserRole): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not defined");
  }
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerService = async (name: string, email: string, password: string) => {
  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    throw new Error("User already exists");
  }

  // Role is always MEMBER on self-registration. Admins can elevate roles separately.
  const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), password, role: UserRole.MEMBER });
  const token = generateToken(user._id.toString(), user.role);

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  };
};

export const loginService = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id.toString(), user.role);

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  };
};

export const getMeService = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
