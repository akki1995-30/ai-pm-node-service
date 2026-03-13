import Task from "../models/Task";
import Project from "../models/Project";
import Team from "../models/Team";

export const createTaskService = async (
  title: string,
  projectId: string,
  assignedTo: string | undefined,
  userId: string
) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error("Project not found");
  }

  const team = await Team.findOne({ _id: project.team, owner: userId });
  if (!team) {
    throw new Error("Not authorized to create tasks in this project");
  }

  return Task.create({ title, project: projectId, assignedTo });
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
