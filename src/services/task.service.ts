import Task from "../models/Task";
import Project from "../models/Project";
import TeamMember from "../models/TeamMember";
import { TeamRole } from "../models/TeamMember";

export const createTaskService = async (
  title: string,
  description: string,
  projectId: string,
  assignedTo: string | undefined,
  userId: string
) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error("Project not found");
  }

  // Verify user is a MANAGER or MEMBER in the project's team (VIEWER cannot create tasks)
  const membership = await TeamMember.findOne({ team: project.team, user: userId });
  if (!membership || !([TeamRole.MANAGER, TeamRole.MEMBER] as string[]).includes(membership.role)) {
    throw new Error("Not authorized to create tasks in this project");
  }

  return Task.create({ title, description, project: projectId, assignedTo });
};

export const getTasksService = async (projectId: string) => {
  return Task.find({ project: projectId }).populate("assignedTo", "name email");
};

export const updateTaskService = async (taskId: string, updates: object) => {
  const task = await Task.findByIdAndUpdate(taskId, updates, { new: true });
  if (!task) {
    throw new Error("Task not found");
  }
  return task;
};

export const deleteTaskService = async (taskId: string) => {
  const task = await Task.findByIdAndDelete(taskId);
  if (!task) {
    throw new Error("Task not found");
  }
  return true;
};
