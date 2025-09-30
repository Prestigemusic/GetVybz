import express from "express";
import cors from "cors";
import profileRoutes from "./routes/profile";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => res.send("Backend running"));

app.use("/profile", profileRoutes);

app.listen(5000, () => console.log("Backend on http://localhost:5000"));
