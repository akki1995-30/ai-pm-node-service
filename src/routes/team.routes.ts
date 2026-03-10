import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import { createTeam, getTeams } from "../controllers/team.controller";

const router = Router();

router.post("/", authMiddleware, createTeam);
router.get("/", authMiddleware, getTeams);

export default router;