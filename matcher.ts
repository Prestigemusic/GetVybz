import axios from "axios";

export async function getSmartMatches(userId: string) {
  try {
    const res = await axios.post("http://localhost:8000/recommend", { userId });
    return res.data;
  } catch (err) {
    return { matches: [] };
  }
}