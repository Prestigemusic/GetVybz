import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { userId, artistId, date, details } = req.body;
    const booking = await prisma.booking.create({
      data: { userId, artistId, date: new Date(date), details },
    });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getBookingsByUser = async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.params.userId },
      include: { artist: { include: { profile: true } } },
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const confirmBooking = async (req: Request, res: Response) => {
  try {
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: "confirmed" },
    });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
