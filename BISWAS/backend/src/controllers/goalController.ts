import { Request, Response } from 'express';
import prisma from '../config/db';

// 1. CREATE a new Goal
export const createGoal = async (req: Request, res: Response): Promise<any> => {
  try {
    const { user_id, title, description } = req.body;

    if (!user_id || !title) {
      return res.status(400).json({ error: "User ID and Title are required" });
    }

    const newGoal = await prisma.goal.create({
      data: {
        user_id,      // Connects the goal to the user
        title,        // "Goal Name" from frontend
        description,  // "Description" from frontend
      },
    });

    return res.status(201).json(newGoal);

  } catch (error) {
    console.error("Error creating goal:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// 2. GET all Goals for a specific User (For the Dashboard)
export const getUserGoals = async (req: Request, res: Response): Promise<any> => {
  try {
    const { user_id } = req.params;

    const goals = await prisma.goal.findMany({
      where: { user_id },
      include: { habits: true } // We include habits so we can count them later
    });

    return res.status(200).json(goals);

  } catch (error) {
    console.error("Error fetching goals:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};