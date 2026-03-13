import jwt from "jsonwebtoken";
import User from "../models/User";

const generateToken = (userId: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not defined");
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerService = async (name: string, email: string, password: string) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error("User already exists");
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id.toString());

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email },
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

  const token = generateToken(user._id.toString());

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email },
  };
};

export const getMeService = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
