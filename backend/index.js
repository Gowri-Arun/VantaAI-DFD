const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ reply: "Empty message received." });
  }

  // Placeholder: No dummy reply
  // You can add AI/ML or keyword-based logic here later
  return res.status(200).json({ reply: "" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

