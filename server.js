require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { OpenAI } = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

mongoose.connect("mongodb://127.0.0.1:27017/therabot", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const Message = mongoose.model("Message", {
  user: String,
  bot: String,
  timestamp: Date,
});

app.post("/ask", async (req, res) => {
  const { message } = req.body;

  const pastMessages = await Message.find().sort({ timestamp: -1 }).limit(5).lean();
  const messages = pastMessages.reverse().flatMap((m) => [
    { role: "user", content: m.user },
    { role: "assistant", content: m.bot }
  ]);

  messages.push({ role: "user", content: `Act as a kind psychologist. User says: "${message}"` });

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messages,
  });

  const reply = completion.choices[0].message.content;

  await Message.create({ user: message, bot: reply, timestamp: new Date() });
  res.json({ reply });
});

app.listen(3000, () => console.log("🧠 Therabot is listening on port 3000"));

