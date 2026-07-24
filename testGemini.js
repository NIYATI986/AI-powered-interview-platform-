
//================================
require("dotenv").config();
const axios = require("axios");

const model = process.env.GEMINI_MODEL || "gemini-flash-lite-latest";
const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

console.log("Using model:", model);

axios.post(url, {
  contents: [{ parts: [{ text: "Say hello in JSON format like {\"message\": \"hello\"}" }] }],
})
  .then((response) => {
    console.log("SUCCESS:");
    console.log(JSON.stringify(response.data, null, 2));
  })
  .catch((err) => {
    console.log("FAILED:");
    console.log(JSON.stringify(err.response?.data || err.message, null, 2));
  });