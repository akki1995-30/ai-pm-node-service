import { Request, Response } from "express";
import Team from "../models/Team";
import TeamMember, { TeamRole } from "../models/TeamMember";
import { AuthRequest } from "../middleware/auth.middleware";

export const createTeam = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Team name is required" });
    }

    const team = await Team.create({ name, description: description || "", owner: req.userId });

    // Auto-add the creator as MANAGER in TeamMember
    await TeamMember.create({
      team: team._id,
      user: req.userId,
      role: TeamRole.MANAGER
    });

    return res.status(201).json(team);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTeams = async (req: AuthRequest, res: Response) => {
  try {
    // Find all team IDs this user belongs to via TeamMember
    const memberships = await TeamMember.find({ user: req.userId }).select("team");
    const teamIds = memberships.map((m) => m.team);

    const teams = await Team.find({ _id: { $in: teamIds } }).populate("owner", "name email");
    return res.json(teams);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /teams/:teamId/members  — add a user to a team with a role
export const addTeamMember = async (req: AuthRequest, res: Response) => {
  try {
    const { teamId } = req.params;
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ message: "userId and role are required" });
    }

    if (!Object.values(TeamRole).includes(role)) {
      return res.status(400).json({ message: `Invalid role. Must be: ${Object.values(TeamRole).join(", ")}` });
    }

    const member = await TeamMember.findOneAndUpdate(
      { team: teamId, user: userId },
      { role },
      { upsert: true, new: true }
    ).populate("user", "name email");

    return res.status(201).json(member);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE /teams/:teamId/members/:userId  — remove a user from a team
export const removeTeamMember = async (req: AuthRequest, res: Response) => {
  try {
    const { teamId, userId } = req.params;

    await TeamMember.findOneAndDelete({ team: teamId, user: userId });

    return res.json({ message: "Member removed successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /teams/:teamId/members  — list all members of a team
export const getTeamMembers = async (req: AuthRequest, res: Response) => {
  try {
    const { teamId } = req.params;

    const members = await TeamMember.find({ team: teamId })
      .populate("user", "name email role");

    return res.json(members);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};