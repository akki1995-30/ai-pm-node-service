import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { createProject, getProjects } from "../controllers/project.controller";

const router = Router();

router.post("/", authMiddleware, createProject);
router.get("/:teamId", authMiddleware, getProjects);

export default router;