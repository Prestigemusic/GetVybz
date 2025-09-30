import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Auth endpoints
app.post("/auth/signup", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Missing fields" });
  return res.status(201).json({ user: { email } });
});

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Missing fields" });
  return res.status(200).json({ user: { email } });
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));