import { Request, Response } from "express";
import Project from "../models/Project";
import Team from "../models/Team";

interface AuthRequest extends Request {
  userId?: string;
}

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { name, teamId } = req.body;

    /* Step 1: Check team exists and belongs to user */

    const team = await Team.findOne({
      _id: teamId,
      owner: req.userId
    });

    if (!team) {
      return res.status(403).json({
        message: "You are not authorized to create projects in this team"
      });
    }

    /* Step 2: Create project */

    const project = await Project.create({
      name,
      team: teamId
    });

    res.status(201).json(project);

  } catch (error) {
    res.status(500).json({
      message: "Error creating project"
    });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {

    const { teamId } = req.params;

    const projects = await Project.find({
      team: teamId
    });

    res.json(projects);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching projects"
    });
  }
};