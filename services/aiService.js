// const axios = require("axios");

// const PROVIDER = (process.env.AI_PROVIDER || "gemini").toLowerCase();



// /**
//  * Strips markdown code fences (```json ... ```) that LLMs sometimes add
//  * around JSON responses, then parses the result.
//  */
// const safeJsonParse = (rawText) => {
//   const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
//   try {
//     return JSON.parse(cleaned);
//   } catch (err) {
//     // Fallback: try to grab the first {...} or [...] block in the text
//     const match = cleaned.match(/[{[][\s\S]*[}\]]/);
//     if (match) {
//       return JSON.parse(match[0]);
//     }
//     throw new Error("AI response was not valid JSON: " + rawText.slice(0, 200));
//   }
// };

// /**
//  * Low-level call to whichever provider is configured.
//  * Always asks the model to respond with ONLY raw JSON (no prose).
//  */
// const callAI = async (prompt) => {
//   if (PROVIDER === "openai") {
//     const response = await axios.post(
//       "https://api.openai.com/v1/chat/completions",
//       {
//         model: process.env.OPENAI_MODEL || "gpt-4o-mini",
//         messages: [
//           {
//             role: "system",
//             content:
//               "You are an AI interview engine. Always respond with ONLY valid JSON, no markdown, no explanation.",
//           },
//           { role: "user", content: prompt },
//         ],
//         temperature: 0.7,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     const text = response.data.choices[0].message.content;
//     return safeJsonParse(text);
//   }

//   // Default: Gemini
//   const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
//   const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

//   const response = await axios.post(url, {
//     contents: [
//       {
//         parts: [
//           {
//             text:
//               "You are an AI interview engine. Always respond with ONLY valid JSON, no markdown, no explanation.\n\n" +
//               prompt,
//           },
//         ],
//       },
//     ],
//     generationConfig: {
//       temperature: 0.7,
//     },
//   });

//   const text = response.data.candidates[0].content.parts[0].text;
//   return safeJsonParse(text);
// };

/**
 * Generates a list of interview questions for a given role.
 * Returns: string[]
 */
// const generateQuestions = async (roleTitle, difficulty = "intermediate", count = 5) => {
//   const prompt = `
// Generate ${count} interview questions for a candidate applying for the role: "${roleTitle}".
// Difficulty level: ${difficulty}.
// Mix technical and behavioral questions relevant to this role.
// Respond with ONLY this JSON shape, nothing else:
// {
//   "questions": ["question 1", "question 2", ...]
// }
// `;
//   const result = await callAI(prompt);
//   if (!Array.isArray(result.questions)) {
//     throw new Error("AI did not return a valid questions array");
//   }
//   return result.questions;
// };

// /**
//  * Sends a single candidate answer to the AI for evaluation.
//  * Returns: { evaluation: string, score: number (0-10) }
//  */
// const evaluateAnswer = async (roleTitle, questionText, answerText) => {
//   const prompt = `
// Role being interviewed for: "${roleTitle}"
// Question asked: "${questionText}"
// Candidate's answer: "${answerText}"

// Evaluate this answer as a strict but fair technical interviewer.
// Respond with ONLY this JSON shape, nothing else:
// {
//   "evaluation": "2-3 sentence feedback on the answer, mentioning strengths and gaps",
//   "score": <integer between 0 and 10>
// }
// `;
//   const result = await callAI(prompt);
//   if (typeof result.score !== "number") {
//     throw new Error("AI did not return a valid score");
//   }
//   return {
//     evaluation: result.evaluation || "",
//     score: Math.max(0, Math.min(10, Math.round(result.score))),
//   };
// };

// /**
//  * Generates overall feedback + final score once all questions are answered.
//  * qaList: [{ questionText, answerText, evaluation, score }]
//  * Returns: { feedback: string, overallScore: number (0-10) }
//  */
// const generateOverallFeedback = async (roleTitle, qaList) => {
//   // Calculate the mathematical average ourselves — don't trust the model for arithmetic
//   const scoredQuestions = qaList.filter((q) => typeof q.score === "number");
//   const averageScore =
//     scoredQuestions.length > 0
//       ? scoredQuestions.reduce((sum, q) => sum + q.score, 0) / scoredQuestions.length
//       : 0;

//   const transcript = qaList
//     .map(
//       (q, i) =>
//         `Q${i + 1}: ${q.questionText}\nAnswer: ${q.answerText}\nPer-question score: ${q.score}/10`
//     )
//     .join("\n\n");

//   const prompt = `
// Role: "${roleTitle}"
// Below is a full interview transcript with per-question scores already calculated.

// ${transcript}

// Write an overall performance summary for the candidate: strengths, weaknesses, and 2-3 concrete
// suggestions for improvement. Keep it to 4-6 sentences.
// Respond with ONLY this JSON shape, nothing else:
// {
//   "feedback": "overall summary text here"
// }
// `;
//   const result = await callAI(prompt);
//   return {
//     feedback: result.feedback || "",
//     overallScore: Math.round(averageScore * 10) / 10, // rounded to 1 decimal
//   };
// };

// module.exports = {
//   generateQuestions,
//   evaluateAnswer,
//   generateOverallFeedback,
// };


















const axios = require("axios");

const PROVIDER = (process.env.AI_PROVIDER || "gemini").toLowerCase();

const safeJsonParse = (rawText) => {
  const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    const match = cleaned.match(/[{[][\s\S]*[}\]]/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error("AI response was not valid JSON: " + rawText.slice(0, 200));
  }
};

/**
 * Low-level call to whichever provider is configured.
 * Always asks the model to respond with ONLY raw JSON (no prose).
 */
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

  // Default: Gemini
  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const response = await axios.post(url, {
    contents: [
      {
        parts: [
          {
            text:
              "You are an AI interview engine. Always respond with ONLY valid JSON, no markdown, no explanation.\n\n" +
              prompt,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.7,
    },
  });

  const text = response.data.candidates[0].content.parts[0].text;
  return safeJsonParse(text);
};




// ---------- High-level interview functions ----------

// Returns { question: "..." }
const generateFirstQuestion = async (roleTitle) => {
  const prompt = `You are conducting a mock interview for a ${roleTitle} position.
Generate the first interview question.

Respond ONLY in this exact JSON format:
{"question": "..."}`;

  const result = await callAI(prompt);
  return result.question;
};

// Returns { score, evaluation, nextQuestion }
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

  return await callAI(prompt);
};

// Returns { overallScore, overallFeedback }
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

  return await callAI(prompt);
};

module.exports = {
  generateFirstQuestion,
  evaluateAnswerAndGenerateNext,
  generateOverallFeedback,
};