import express from "express";
import cors from "cors";
import profileRoutes from "./routes/profile";
import bookingRoutes from "./routes/booking";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => res.send("Backend running"));

app.use("/profile", profileRoutes);
app.use("/bookings", bookingRoutes);

app.listen(5000, () => console.log("Backend on http://localhost:5000"));
