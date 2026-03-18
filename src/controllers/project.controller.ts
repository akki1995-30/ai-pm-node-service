import { Request, Response } from "express";
import { createProjectService, getProjectsService, getProjectByIdService } from "../services/project.service";

interface AuthRequest extends Request {
  userId?: string;
}

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { name, teamId, description } = req.body;

    if (!name || !teamId) {
      return res.status(400).json({ message: "name and teamId are required" });
    }

    const project = await createProjectService(name, description || "", teamId, req.userId!);
    return res.status(201).json(project);
  } catch (error: any) {
    const status = error.message.includes("not authorized") ? 403 : 500;
    return res.status(status).json({ message: error.message });
  }
};

export const getProjects = async (req: any, res: Response) => {
  try {
      const { teamId } = req.params;
    const projects = await getProjectsService(teamId);
    return res.json(projects);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getProject = async (req: any, res: Response) => {
  try {
    const { projectId } = req.params;
    const project = await getProjectByIdService(projectId);
    return res.json(project);
  } catch (error: any) {
    const status = error.message === "Project not found" ? 404 : 500;
    return res.status(status).json({ message: error.message });
  }
};