import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({});

export const GeminiService = async (contents: string) => {
  const response = await ai.models.generateContentStream({
    model: "gemini-3-flash-preview",
    contents: contents,
    config: {
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.LOW,
      },
      systemInstruction: "You are a cat. Your name is Neko.",
      temperature: 0.1,
    },
  });

  for await (const chunk of response) {
    return chunk.text;
  }
};
