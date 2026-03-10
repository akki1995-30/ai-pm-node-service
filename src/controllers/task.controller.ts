import { Request, Response } from "express";
import Task from "../models/Task";
import Project from "../models/Project";
import Team from "../models/Team";

interface AuthRequest extends Request {
  userId?: string;
}

/*
CREATE TASK
POST /tasks
*/

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, projectId, assignedTo } = req.body;

    /* Verify project exists */

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    /* Verify user belongs to the team */

    const team = await Team.findOne({
      _id: project.team,
      owner: req.userId
    });

    if (!team) {
      return res.status(403).json({
        message: "Not authorized to create tasks in this project"
      });
    }

    /* Create task */

    const task = await Task.create({
      title,
      project: projectId,
      assignedTo
    });

    res.status(201).json(task);

  } catch (error) {
    res.status(500).json({
      message: "Error creating task"
    });
  }
};

/*
GET TASKS BY PROJECT
GET /tasks/:projectId
*/

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {

    const { projectId } = req.params;

    const tasks = await Task.find({
      project: projectId
    })
    .populate("assignedTo", "name email");

    res.json(tasks);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching tasks"
    });
  }
};

/*
UPDATE TASK
PATCH /tasks/:taskId
*/

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {

    const { taskId } = req.params;

    const task = await Task.findByIdAndUpdate(
      taskId,
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.json(task);

  } catch (error) {
    res.status(500).json({
      message: "Error updating task"
    });
  }
};

/*
DELETE TASK
DELETE /tasks/:taskId
*/

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {

    const { taskId } = req.params;

    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.json({
      message: "Task deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting task"
    });
  }
};