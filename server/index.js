require("dotenv").config({ path: "./server/.env" });
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
        { role: "system", content: "You are Blossom, a kind and friendly AI coding helper for kids ages 8–13." },
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