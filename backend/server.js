const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "StudyMate AI Backend Running"
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "gemma3:1b",
        prompt: message,
        stream: false
      }
    );

    res.json({
      reply: response.data.response
    });

  } catch (error) {
    console.error("AI Error:", error.message);

    res.status(500).json({
      message: "AI request failed"
    });
  }
});
app.post("/api/summarize", async (req, res) => {
  try {
    const { notes } = req.body;

    if (!notes || !notes.trim()) {
      return res.status(400).json({
        message: "Please provide some notes"
      });
    }

    const prompt = `
You are a helpful study assistant.

Summarize the following study notes in simple language.
Give:
1. A short summary
2. Important points
3. Key terms

Notes:
${notes}
`;

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "gemma3:1b",
        prompt: prompt,
        stream: false
      }
    );

    res.json({
      summary: response.data.response
    });

  } catch (error) {
    console.error("Summarizer Error:", error.message);

    res.status(500).json({
      message: "Summary generation failed"
    });
  }
});
app.post("/api/quiz", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({
        message: "Please provide a topic"
      });
    }

    const prompt = `
You are a helpful study assistant.

Create 5 multiple-choice questions about the following topic:

${topic}

For each question provide:
1. Question
2. Four options: A, B, C, D
3. Correct answer
4. A short explanation

Keep the questions suitable for college students and use simple language.
`;

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "gemma3:1b",
        prompt: prompt,
        stream: false
      }
    );

    res.json({
      quiz: response.data.response
    });

  } catch (error) {
    console.error("Quiz Error:", error.message);

    res.status(500).json({
      message: "Quiz generation failed"
    });
  }
});

app.listen(5000, () => {
  console.log("StudyMate AI backend running on port 5000");
});