import { Request, Response } from "express";
import { createTaskService, getTasksService, updateTaskService, deleteTaskService } from "../services/task.service";

interface AuthRequest extends Request {
  userId?: string;
}

/* POST /tasks */
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, projectId, assignedTo } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ message: "title and projectId are required" });
    }

    const task = await createTaskService(title, projectId, assignedTo, req.userId!);
    return res.status(201).json(task);
  } catch (error: any) {
    const status = error.message === "Project not found" ? 404
      : error.message.includes("Not authorized") ? 403 : 500;
    return res.status(status).json({ message: error.message });
  }
};

/* GET /tasks/:projectId */
export const getTasks = async (req: any, res: Response) => {
  try {
    const { projectId } = req.params;
    const tasks = await getTasksService(projectId);
    return res.json(tasks);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/* PATCH /tasks/:taskId */
export const updateTask = async (req: any, res: Response) => {
  try {
    const { taskId } = req.params;
    const task = await updateTaskService(taskId, req.body);
    return res.json(task);
  } catch (error: any) {
    const status = error.message === "Task not found" ? 404 : 500;
    return res.status(status).json({ message: error.message });
  }
};

/* DELETE /tasks/:taskId */
export const deleteTask = async (req: any, res: Response) => {
  try {
    const { taskId } = req.params;
    await deleteTaskService(taskId);
    return res.json({ message: "Task deleted successfully" });
  } catch (error: any) {
    const status = error.message === "Task not found" ? 404 : 500;
    return res.status(status).json({ message: error.message });
  }
};