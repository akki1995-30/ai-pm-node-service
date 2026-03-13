import { Request, Response } from "express";
import Team from "../models/Team";

interface AuthRequest extends Request {
  userId?: string;
}

export const createTeam = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Team name is required" });
    }

    const team = await Team.create({ name, owner: req.userId });
    return res.status(201).json(team);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTeams = async (req: AuthRequest, res: Response) => {
  try {
    const teams = await Team.find({ owner: req.userId }).populate("owner", "name email");
    return res.json(teams);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};