import { Request, Response } from "express";
import { registerService, loginService, getMeService } from "../services/auth.service";

/**
 * Register User
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
      const { name, email, password } = req.body;
      console.log('req', req.originalUrl);

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const result = await registerService(name, email, password);
    return res.status(201).json(result);
  } catch (error: any) {
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
      return res.status(400).json({ message: "All fields are required" });
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