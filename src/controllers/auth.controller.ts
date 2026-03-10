import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

/**
 * Generate JWT token
 */
const generateToken = (userId: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not defined");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
/**
 * Register User
 */
export const registerUser = async (req: Request, res: Response) => {
    try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

        const token = generateToken(user._id.toString());
        console.log('token', token);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
    } catch (error) {
        console.log("error", error);
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

/**
 * Login User
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id.toString());

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

/**
 * Get current logged in user
 */
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
};