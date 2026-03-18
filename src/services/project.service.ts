import Project from "../models/Project";
import TeamMember from "../models/TeamMember";
import { TeamRole } from "../models/TeamMember";

export const createProjectService = async (
  name: string,
  description: string,
  teamId: string,
  userId: string
) => {
  // Verify user is a MANAGER in this team (middleware already checks, but defence-in-depth)
  const membership = await TeamMember.findOne({ team: teamId, user: userId });
  if (!membership || membership.role !== TeamRole.MANAGER) {
    throw new Error("Only team MANAGERs can create projects");
  }

  const project = await Project.create({ name, description, team: teamId });
  return project;
};

export const getProjectsService = async (teamId: string) => {
  return Project.find({ team: teamId });
};

export const getProjectByIdService = async (projectId: string) => {
  const project = await Project.findById(projectId);
  if (!project) throw new Error("Project not found");
  return project;
};
