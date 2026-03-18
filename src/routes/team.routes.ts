import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { requireRole, requireTeamRole } from "../middleware/role.middleware";
import { TeamRole } from "../models/TeamMember";
import { UserRole } from "../models/User";
import {
  createTeam,
  getTeams,
  addTeamMember,
  removeTeamMember,
  getTeamMembers
} from "../controllers/team.controller";

const router = Router();

// Only global MANAGER (or ADMIN) can create teams
router.post("/",   authMiddleware, requireRole(UserRole.MANAGER, UserRole.ADMIN), createTeam);
router.get("/",    authMiddleware, getTeams);

// Member management — only MANAGER (or ADMIN) can add/remove
router.get("/:teamId/members",
  authMiddleware,
  requireTeamRole(TeamRole.MANAGER, TeamRole.MEMBER, TeamRole.VIEWER),
  getTeamMembers
);

router.post("/:teamId/members",
  authMiddleware,
  requireTeamRole(TeamRole.MANAGER),
  addTeamMember
);

router.delete("/:teamId/members/:userId",
  authMiddleware,
  requireTeamRole(TeamRole.MANAGER),
  removeTeamMember
);

export default router;