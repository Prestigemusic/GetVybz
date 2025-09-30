import { Router } from "express";
import { createBooking, getBookingsByUser, confirmBooking } from "../controllers/bookingController";

const router = Router();

router.post("/", createBooking);
router.get("/:userId", getBookingsByUser);
router.put("/:id/confirm", confirmBooking);

export default router;
