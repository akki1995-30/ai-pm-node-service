import { Request, Response } from "express";
import Team from "../models/Team";

export const createTeam = async (req: any, res: Response) => {
  try {
    const { name } = req.body;

    const team = await Team.create({
      name,
      owner: req.userId
    });

    res.status(201).json(team);

  } catch (error) {
    res.status(500).json({ message: "Error creating team" });
  }
};

export const getTeams = async (req: any, res: Response) => {
  const teams = await Team.find({ owner: req.userId });
  res.json(teams);
};