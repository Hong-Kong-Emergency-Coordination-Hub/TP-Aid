import { GoogleGenAI } from "@google/genai";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSafetyAdvice = async (query: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an emergency response assistant for a fire incident in Hong Kong (Tai Po).
      Provide a concise, calm, and actionable safety tip or answer regarding: "${query}".
      Respond in Traditional Chinese (Cantonese context).
      Keep it under 60 words. Focus on immediate safety or resource finding.
      If the query is irrelevant to safety/disaster, politely deflect in Cantonese.`,
    });
    return response.text || "暫時無法提供建議。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "服務暫停，緊急情況請致電 999。";
  }
};