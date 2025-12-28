// src/services/GeminiService.js

// 👇 PASTE YOUR KEY INSIDE THESE QUOTES 👇
const GEMINI_API_KEY = 'AIzaSyAHpa-pG6_54yBExUw720k5uxfvBFE1BZw'; 

const MODEL_NAME = 'gemini-2.5-flash';

export const analyzeTextWithGemini = async (inputText) => {
  try {
    console.log("Analyzing with Gemini...");

    // 1. THE EXPERT PROMPT
    const prompt = `
      You are an expert Cybersecurity Analyst. Analyze the following text for scam risk.
      
      INPUT TEXT:
      "${inputText}"

      OUTPUT REQUIREMENT:
      Return strictly RAW JSON. No markdown. No explanations outside JSON.
      Schema:
      {
        "isScam": boolean,
        "score": number (0-100),
        "verdict": string (e.g. "Phishing Attempt"),
        "scamType": string,
        "summary": string,
        "action": string,
        "keyFindings": [ { "id": 1, "icon": "alert-circle", "text": "finding" } ]
      }
    `;

    // 2. CALL THE API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
      }
    );

    const data = await response.json();

    // 🔴 LOGGING FOR DEBUGGING
    // This will show up in your terminal so you can see if the key works
    console.log("Gemini Response Status:", response.status);

    // 3. ERROR HANDLING (Prevents the crash you saw)
    if (data.error) {
      console.error("Gemini API Error:", data.error.message);
      return {
        isScam: false,
        score: 0,
        verdict: "API Error",
        summary: `Google Error: ${data.error.message}. Check your API Key.`,
        action: "Fix API Key",
        keyFindings: []
      };
    }

    // Safety Filter Check
    if (!data.candidates || data.candidates.length === 0) {
      return {
        isScam: false,
        score: 0,
        verdict: "Safety Block",
        summary: "Gemini refused to analyze this content (Safety Filter Triggered).",
        action: "Try different text",
        keyFindings: []
      };
    }

    // 4. PARSE RESULT
    let rawText = data.candidates[0].content.parts[0].text;
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    const result = JSON.parse(rawText);
    return result;

  } catch (error) {
    console.error("Gemini Service Crash:", error);
    return {
      isScam: false,
      score: 0,
      verdict: "Connection Error",
      summary: "Could not connect to AI. Please check internet connection.",
      action: "Try again",
      keyFindings: []
    };
  }
};