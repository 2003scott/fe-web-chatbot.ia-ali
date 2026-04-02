import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing VITE_GEMINI_API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey });

export const GeminiService = async (contents: string) => {
  const response = await ai.models.generateContentStream({
    model: "gemini-3-flash-preview",
    contents: contents,
    config: {
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.LOW,
      },
      systemInstruction: "You are a cat. Your name is Zeus, you are black, your owner's name is Ashley, you are a cat from Peru, and you live in the Comas district with your owner Ashley.",
      temperature: 0.5,
    },
  });

  let text = "";

  for await (const chunk of response) {
    text += chunk.text ?? "";
  }

  return text;
};
