const axios = require("axios");
const { GoogleGenAI } = require("@google/genai");

const PROVIDER = (process.env.AI_PROVIDER || "gemini").toLowerCase();

let geminiClient = null;
const getGeminiClient = () => {
  const apiKey = (process.env.GEMINI_API_KEY || "").trim();
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Add GEMINI_API_KEY to your .env file to generate interview questions."
    );
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
};

const safeJsonParse = (rawText) => {
  const cleaned = (rawText || "").replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    const match = cleaned.match(/[{[][\s\S]*[}\]]/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error("AI response was not valid JSON: " + (rawText || "").slice(0, 200));
  }
};

const callAI = async (prompt) => {
  if (PROVIDER === "openai") {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an AI interview engine. Always respond with ONLY valid JSON, no markdown, no explanation.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const text = response.data.choices[0].message.content;
    return safeJsonParse(text);
  }

  const ai = getGeminiClient();
  const model = process.env.GEMINI_MODEL || "gemini-4-hydrogen";

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction:
        "You are an AI interview engine. Always respond with ONLY valid JSON, no markdown, no explanation.",
      responseMimeType: "application/json",
    },
  });

  return safeJsonParse(response.text);
};

const generateFirstQuestion = async (roleTitle, difficulty = "intermediate") => {
  const prompt = `You are conducting a mock interview for a ${roleTitle} position (difficulty: ${difficulty}).
Generate the first technical or behavioral interview question tailored to this role and level.

Respond ONLY in this exact JSON format:
{"question": "..."}`;

  const result = await callAI(prompt);
  if (!result?.question || typeof result.question !== "string") {
    throw new Error("Gemini API did not return a valid interview question.");
  }
  return result.question.trim();
};

const evaluateAnswerAndGenerateNext = async (
  roleTitle,
  questionHistory,
  questionNumber,
  totalQuestions
) => {
  const historyText = questionHistory
    .map((q, i) => `Q${i + 1}: ${q.questionText}\nA${i + 1}: ${q.answerText}`)
    .join("\n\n");

  const isLastQuestion = questionNumber >= totalQuestions;

  const prompt = `You are conducting a mock interview for a ${roleTitle} position.

Interview so far:
${historyText}

Evaluate the most recent answer. Give a score from 0 to 10, and a brief written evaluation (2-3 sentences).
${
  isLastQuestion
    ? "This was the final question — do NOT generate a new question."
    : "Then generate the next interview question, different from previous ones."
}

Respond ONLY in this exact JSON format:
{"score": 0, "evaluation": "...", "nextQuestion": ${isLastQuestion ? "null" : '"..."'}}`;

  const result = await callAI(prompt);
  const rawScore = Number(result?.score);
  const score = Number.isFinite(rawScore) ? Math.max(0, Math.min(10, Math.round(rawScore))) : 0;

  return {
    score,
    evaluation: result?.evaluation || "Answer recorded.",
    nextQuestion: isLastQuestion ? null : result?.nextQuestion || null,
  };
};

const generateOverallFeedback = async (roleTitle, questionHistory) => {
  const historyText = questionHistory
    .map(
      (q, i) =>
        `Q${i + 1}: ${q.questionText}\nA${i + 1}: ${q.answerText}\nScore: ${q.score}/10\nEvaluation: ${q.evaluation}`
    )
    .join("\n\n");

  const prompt = `You are evaluating a completed mock interview for a ${roleTitle} position.

${historyText}

Write an overall performance feedback (4-6 sentences) covering strengths and areas to improve.
Also give an overall score out of 10.

Respond ONLY in this exact JSON format:
{"overallScore": 0, "overallFeedback": "..."}`;

  const result = await callAI(prompt);
  const rawScore = Number(result?.overallScore);
  const overallScore = Number.isFinite(rawScore)
    ? Math.max(0, Math.min(10, Math.round(rawScore * 10) / 10))
    : 0;

  return {
    overallScore,
    overallFeedback: result?.overallFeedback || "Interview completed.",
  };
};

module.exports = {
  generateFirstQuestion,
  evaluateAnswerAndGenerateNext,
  generateOverallFeedback,
};