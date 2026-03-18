import { Request, Response } from "express";
import { registerService, loginService, getMeService } from "../services/auth.service";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

/**
 * Register User — role is always MEMBER, cannot be set by the client
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    if (name.trim().length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters" });
    }

    const result = await registerService(name, email, password);
    return res.status(201).json(result);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }
    const status = error.message === "User already exists" ? 400 : 500;
    return res.status(status).json({ message: error.message });
  }
};

/**
 * Login User
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const result = await loginService(email, password);
    return res.status(200).json(result);
  } catch (error: any) {
    const status = error.message === "Invalid credentials" ? 401 : 500;
    return res.status(status).json({ message: error.message });
  }
};

/**
 * Get current logged in user
 */
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await getMeService(userId);
    return res.status(200).json(user);
  } catch (error: any) {
    const status = error.message === "User not found" ? 404 : 500;
    return res.status(status).json({ message: error.message });
  }
};