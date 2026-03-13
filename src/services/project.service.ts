import Project from "../models/Project";
import Team from "../models/Team";

export const createProjectService = async (
  name: string,
  teamId: string,
  userId: string
) => {
  const team = await Team.findOne({ _id: teamId, owner: userId });
  if (!team) {
    throw new Error("You are not authorized to create projects in this team");
  }

  const project = await Project.create({ name, team: teamId });
  return project;
};

export const getProjectsService = async (teamId: string) => {
  return Project.find({ team: teamId });
};
