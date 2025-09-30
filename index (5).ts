import express from "express";
import cors from "cors";
import { getSmartMatches } from "./ai/matcher";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => res.send("Backend running"));

app.post("/recommend", async (req, res) => {
  const { userId } = req.body;
  const data = await getSmartMatches(userId);
  res.json(data);
});

app.listen(5000, () => console.log("Backend on http://localhost:5000"));
