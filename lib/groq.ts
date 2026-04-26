import { ChatGroq } from "@langchain/groq";

if (!process.env.GROQ_API_KEY) {
  throw new Error("Missing GROQ_API_KEY in environment variables");
}

export const parserModel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY, 
  model: "llama-3.3-70b-versatile", 
  temperature: 0,
});

export const engagementModel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant",
  temperature: 0.7,
});