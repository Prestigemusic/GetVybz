import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getProfile = async (req: Request, res: Response) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.params.id },
    });
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { fullName, bio, avatarUrl } = req.body;
    const profile = await prisma.profile.update({
      where: { userId: req.params.id },
      data: { fullName, bio, avatarUrl },
    });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
