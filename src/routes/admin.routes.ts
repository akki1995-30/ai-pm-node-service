import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { UserRole } from "../models/User";
import { listUsers, assignUserRole, setUserStatus } from "../controllers/admin.controller";

const router = Router();

// All admin routes require authentication + ADMIN global role
router.use(authMiddleware, requireRole(UserRole.ADMIN));

// GET  /admin/users                    — list all users
router.get("/users", listUsers);

// PATCH /admin/users/:userId/role      — assign global role
router.patch("/users/:userId/role", assignUserRole);

// PATCH /admin/users/:userId/status    — activate / deactivate user
router.patch("/users/:userId/status", setUserStatus);

export default router;
