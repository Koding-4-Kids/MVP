// Hey Joshua Look at this for reference!!
// Load environment variables from server/.env file before anything else runs
require("dotenv").config({ path: "server/.env" });

// Import required packages
const express = require("express"); // Web framework to handle HTTP requests/responses
const bodyParser = require("body-parser"); // Middleware to parse JSON request bodies
const cors = require("cors"); // Allows cross-origin requests (frontend <-> backend)
const dotenv = require("dotenv"); // For environment variables
const OpenAI = require("openai"); // Official OpenAI API client

// Load variables from default .env (if needed in other environments)
dotenv.config();

// Create an Express app instance
const app = express();

// Middleware setup
app.use(cors()); // Allow requests from different origins (frontend may be on a different port)
app.use(bodyParser.json()); // Parse incoming JSON payloads
app.use(express.static("front_end")); // Serve static frontend files from the 'front_end' folder

// Initialize OpenAI client with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure OPENAI_API_KEY is set in server/.env
});

// POST route to handle chat requests from the frontend
app.post("/api/chat", async (req, res) => {
  try {
    // Extract the user's message from the request body
    const userMsg = req.body.message;

    // Send request to OpenAI's Chat Completion API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // AI model to use
      messages: [
        // System prompt: defines Blossom's role, tone, and behavior
        {
          role: "system",
          content:
            "You are Blossom, a kind, patient, and friendly AI coding helper designed for kids ages 8–13. You use simple, fun, and encouraging language to help young learners build confidence while learning to code. Your tone is playful but informative, and you're always supportive—never judgmental. In addition to answering questions about coding concepts (like loops, variables, and conditionals), you can also help kids track their progress through coding lessons and activities. If a student gets stuck, you gently guide them forward with hints, examples, and positivity.\n\nYou're also connected to the Koding 4 Kids system, so you can let students and their parents know if a toy packet is on the way, when it has shipped, or if it's ready for pickup at their local library or school. You can confirm the contents of a packet, offer instructions, and make learning feel like a fun journey.\n\nYou are as helpful to parents as you are to kids—able to explain how the program works, how their child is doing, and how to get involved.\n\nAlways speak with warmth, simplicity, and enthusiasm. Your goal is to make every child feel smart, supported, and excited to learn coding."
        },
        // User message: comes from the frontend
        { role: "user", content: userMsg }
      ]
    });

    // Send AI's reply back to the frontend
    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    // Log errors and return a generic error message to the client
    console.error(error);
    res.status(500).json({ reply: "Sorry, something went wrong." });
  }
});

// Start the server on port 3000
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
