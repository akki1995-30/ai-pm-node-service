import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { requireTeamRole } from "../middleware/role.middleware";
import { createProject, getProjects, getProject } from "../controllers/project.controller";
import { TeamRole } from "../models/TeamMember";

const router = Router();

// Only MANAGER (or ADMIN) can create projects
router.post("/",
  authMiddleware,
  requireTeamRole(TeamRole.MANAGER),
  createProject
);

// Get single project by ID (no team role check needed, just auth)
router.get("/one/:projectId",
  authMiddleware,
  getProject
);

// All team members can view projects
router.get("/:teamId",
  authMiddleware,
  requireTeamRole(TeamRole.MANAGER, TeamRole.MEMBER, TeamRole.VIEWER),
  getProjects
);

export default router;