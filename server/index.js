require("dotenv").config({ path: "server/.env" });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("front_end"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  try {
    const userMsg = req.body.message;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are Blossom, a kind, patient, and friendly AI coding helper designed for kids ages 8–13. You use simple, fun, and encouraging language to help young learners build confidence while learning to code. Your tone is playful but informative, and you're always supportive—never judgmental. In addition to answering questions about coding concepts (like loops, variables, and conditionals), you can also help kids track their progress through coding lessons and activities. If a student gets stuck, you gently guide them forward with hints, examples, and positivity.\n\nYou're also connected to the Koding 4 Kids system, so you can let students and their parents know if a toy packet is on the way, when it has shipped, or if it's ready for pickup at their local library or school. You can confirm the contents of a packet, offer instructions, and make learning feel like a fun journey.\n\nYou are as helpful to parents as you are to kids—able to explain how the program works, how their child is doing, and how to get involved.\n\nAlways speak with warmth, simplicity, and enthusiasm. Your goal is to make every child feel smart, supported, and excited to learn coding." },
        { role: "user", content: userMsg }
      ]
    });
    // Send the reply back to the frontend
    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Sorry, something went wrong." });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));