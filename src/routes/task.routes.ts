import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { requireTeamRole } from "../middleware/role.middleware";
import { TeamRole } from "../models/TeamMember";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} from "../controllers/task.controller";

const router = Router();

// MANAGER and MEMBER can create tasks
router.post("/",
  authMiddleware,
  requireTeamRole(TeamRole.MANAGER, TeamRole.MEMBER),
  createTask
);

// All team members can view tasks
router.get("/:projectId",
  authMiddleware,
  requireTeamRole(TeamRole.MANAGER, TeamRole.MEMBER, TeamRole.VIEWER),
  getTasks
);

// MANAGER and MEMBER can update/assign tasks
router.patch("/:taskId",
  authMiddleware,
  requireTeamRole(TeamRole.MANAGER, TeamRole.MEMBER),
  updateTask
);

// Only MANAGER can delete tasks
router.delete("/:taskId",
  authMiddleware,
  requireTeamRole(TeamRole.MANAGER),
  deleteTask
);

export default router;