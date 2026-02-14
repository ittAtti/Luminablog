
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateDraft(topic: string) {
    if (!process.env.API_KEY) {
      return {
        title: "Sample AI Draft",
        content: `Draft for topic: ${topic}. (API Key missing - please ensure it is provided in the environment).`
      };
    }

    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Write a short, engaging blog post about: ${topic}. Focus on quality and a modern tone.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              excerpt: { type: Type.STRING }
            },
            required: ["title", "content", "excerpt"]
          }
        }
      });

      return JSON.parse(response.text || "{}");
    } catch (error) {
      console.error("Gemini Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
