import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} from "../controllers/task.controller";

const router = Router();

router.post("/", authMiddleware, createTask);

router.get("/:projectId", authMiddleware, getTasks);

router.patch("/:taskId", authMiddleware, updateTask);

router.delete("/:taskId", authMiddleware, deleteTask);

export default router;