import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { UserRole } from "../models/User";
import { TeamRole } from "../models/TeamMember";
import TeamMember from "../models/TeamMember";
import Project from "../models/Project";
import Task from "../models/Task";

/**
 * Guard: check global user role (stored in JWT)
 * e.g. requireRole(UserRole.ADMIN)
 */
export const requireRole = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.userRole) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(" or ")}`
      });
    }
    next();
  };
};

/**
 * Resolves teamId from various sources:
 *  1. req.params.teamId or req.body.teamId  (team routes / project create)
 *  2. project lookup via req.params.projectId or req.body.projectId  (task create / project get)
 *  3. task lookup via req.params.taskId  (task update / delete)
 */
const resolveTeamId = async (req: AuthRequest): Promise<string | null> => {
  // Direct teamId
  if (req.params.teamId) return Array.isArray(req.params.teamId) ? req.params.teamId[0] : req.params.teamId;
  if (req.body?.teamId)  return Array.isArray(req.body.teamId) ? req.body.teamId[0] : req.body.teamId;

  // From projectId
  const projectId = req.params.projectId || req.body?.projectId;
  if (projectId) {
    const project = await Project.findById(projectId).lean();
    return project ? String(project.team) : null;
  }

  // From taskId — look up task → project → team
  const taskId = req.params.taskId;
  if (taskId) {
    const task = await Task.findById(taskId).populate<{ project: { team: any } }>("project", "team").lean();
    if (task?.project) {
      return String((task.project as any).team);
    }
  }

  return null;
};

/**
 * Guard: check team-level role (stored in TeamMember collection)
 * Automatically resolves teamId from params, body, or related project/task.
 * ADMIN always bypasses.
 */
export const requireTeamRole = (...roles: TeamRole[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // ADMIN bypasses all team role checks
      if (req.userRole === UserRole.ADMIN) return next();

      const teamId = await resolveTeamId(req);

      if (!teamId) {
        return res.status(400).json({ message: "Could not determine team context" });
      }

      const member = await TeamMember.findOne({ team: teamId, user: req.userId });

      if (!member) {
        return res.status(403).json({ message: "You are not a member of this team" });
      }

      if (!roles.includes(member.role as TeamRole)) {
        return res.status(403).json({
          message: `Insufficient team role. Required: ${roles.join(" or ")}, your role: ${member.role}`
        });
      }

      // Attach resolved teamId so downstream handlers can use it
      (req as any).resolvedTeamId = teamId;
      next();
    } catch (err: any) {
      res.status(500).json({ message: "Role check failed", error: err.message });
    }
  };
};
