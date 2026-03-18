import { Response } from "express";
import User, { UserRole } from "../models/User";
import { AuthRequest } from "../middleware/auth.middleware";

/**
 * GET /admin/users
 * List all registered users (ADMIN only)
 */
export const listUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json(users);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * PATCH /admin/users/:userId/role
 * Assign or change a user's global role (ADMIN only)
 * Body: { role: "ADMIN" | "MANAGER" | "MEMBER" | "VIEWER" }
 */
export const assignUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "role is required" });
    }

    if (!Object.values(UserRole).includes(role)) {
      return res.status(400).json({
        message: `Invalid role. Must be one of: ${Object.values(UserRole).join(", ")}`,
      });
    }

    // Prevent an admin from demoting themselves accidentally
    if (userId === req.userId && role !== UserRole.ADMIN) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "Role updated successfully", user });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * PATCH /admin/users/:userId/status
 * Activate or deactivate a user (ADMIN only)
 * Body: { status: "active" | "inactive" }
 */
export const setUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!status || !["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "status must be 'active' or 'inactive'" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User status updated", user });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
